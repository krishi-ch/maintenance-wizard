import os
from typing import List
from langchain_community.document_loaders import TextLoader, DirectoryLoader, UnstructuredMarkdownLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

class RAGEngine:
    def __init__(self, data_dir: str = "data/manuals", persist_dir: str = "backend/db"):
        self.data_dir = data_dir
        self.persist_dir = persist_dir
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.embeddings = OpenAIEmbeddings()
            self.vector_store = None
            self._initialize_vector_store()
        else:
            print("WARNING: OPENAI_API_KEY not found. RAG running in MOCK mode.")
            self.vector_store = None

    def _initialize_vector_store(self):
        if os.path.exists(self.persist_dir) and os.listdir(self.persist_dir):
            self.vector_store = Chroma(persist_directory=self.persist_dir, embedding_function=self.embeddings)
        else:
            self.ingest_documents()

    def ingest_documents(self):
        loader = DirectoryLoader(self.data_dir, glob="**/*.md", loader_cls=UnstructuredMarkdownLoader)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)
        
        self.vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_dir
        )
        self.vector_store.persist()

    def query(self, text: str, k: int = 3):
        if not self.api_key:
            return self._mock_query(text)
        if not self.vector_store:
            return []
        results = self.vector_store.similarity_search(text, k=k)
        return results

    def _mock_query(self, text: str):
        # Return mock documents based on the manual I created
        from langchain.schema import Document
        content = """
        Symptom: High Delta T (>10°C)
        - Possible Cause: Reduced water flow or internal scale buildup.
        - Action: Check for pump efficiency. If flow is normal, schedule a chemical cleaning (descaling).
        """
        return [Document(page_content=content, metadata={"source": "mock_manual.md"})]

if __name__ == "__main__":
    # Test
    engine = RAGEngine()
    res = engine.query("What should I do for high Delta T?")
    for r in res:
        print(f"Content: {r.page_content[:100]}...")
