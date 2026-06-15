import os
from typing import List

# Create a mock Document class if langchain is not available
try:
    from langchain.schema import Document
    DOCUMENT_CLASS = Document
except ImportError:
    class Document:
        def __init__(self, page_content, metadata=None):
            self.page_content = page_content
            self.metadata = metadata or {}

class RAGEngine:
    def __init__(self, data_dir: str = "data/manuals", persist_dir: str = "backend/db"):
        self.data_dir = data_dir
        self.persist_dir = persist_dir
        self.api_key = os.getenv("OPENAI_API_KEY")
        # Always run in mock mode to avoid dependencies
        self.vector_store = None

    def _initialize_vector_store(self):
        pass

    def ingest_documents(self):
        pass

    def query(self, text: str, k: int = 3):
        return self._mock_query(text)

    def _mock_query(self, text: str):
        # Return mock documents
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
