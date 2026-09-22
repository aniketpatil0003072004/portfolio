# Portfolio RAG backend

This backend indexes the structured content in `data/portfolio.json` into ChromaDB and answers questions through the OpenRouter model configured in the root `.env` file.

## First-time setup

From the repository root:

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r rag/requirements.txt
python rag/ingest.py
uvicorn rag.server:app --reload --port 8000
```

The ingestion command downloads the local embedding model the first time. It does not need an API key. The server needs the OpenRouter key and model from `.env`.

## Environment

Copy `.env.example` to `.env` and fill in `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` only after choosing the model in OpenRouter.

The browser never receives the OpenRouter key. It calls the local `/chat` backend endpoint instead.
