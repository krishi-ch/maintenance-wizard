import subprocess
import time
import os
import sys

def start_backend():
    print("Starting Backend...")
    return subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"], cwd="backend")

def start_frontend():
    print("Starting Frontend...")
    return subprocess.Popen(["npm", "run", "dev"], cwd="frontend", shell=True)

if __name__ == "__main__":
    backend = start_backend()
    time.sleep(2)
    frontend = start_frontend()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        backend.terminate()
        frontend.terminate()
        print("Stopped.")
