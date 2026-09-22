# Aniket Patil — Portfolio

A Next.js portfolio with a white editorial visual system and a grounded RAG portfolio assistant.

## Frontend

```bash
npm install
npm run dev
```

The site uses Next.js, React, Framer Motion, and React Icons. Portfolio content is centralized in `data/portfolio.json`; the UI and the RAG indexer use the same source.

## RAG assistant

The assistant uses:

- ChromaDB for the local vector database
- `sentence-transformers/all-MiniLM-L6-v2` for local embeddings
- OpenRouter for configurable answer generation
- FastAPI for the server-side API

The OpenRouter key is never sent to the browser.

### Setup

1. Copy `.env.example` to `.env`.
2. Add your OpenRouter key and the model ID you choose in OpenRouter.
3. Create a Python environment and install the RAG dependencies:

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r rag/requirements.txt
```

4. Build the local ChromaDB index:

```bash
python rag/ingest.py
```

5. Start the API in a second terminal:

```bash
uvicorn rag.server:app --reload --port 8000
```

6. Start the Next.js frontend with `npm run dev`.

The chatbot defaults to `http://127.0.0.1:8000`. For another backend URL, set `NEXT_PUBLIC_RAG_API_URL` in `.env`.

## Safe review workflow

- `.env`, ChromaDB data, and Python caches are ignored by Git.
- `.env.example` contains names only, never secrets.
- The work is local on the `development` branch. No changes are pushed automatically.
- Update `data/portfolio.json`, then run `python rag/ingest.py` again whenever portfolio content changes.
