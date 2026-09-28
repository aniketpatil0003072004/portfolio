# Aniket Patil — Portfolio

A Next.js portfolio with a white editorial visual system and a state-of-the-art Agentic RAG portfolio assistant powered by LangChain, LangGraph, and the Model Context Protocol (MCP).

## Frontend

```bash
npm install
npm run dev
```

The site uses Next.js, React, Framer Motion, and React Icons. Portfolio content is centralized in `data/portfolio.json`; the UI and the RAG indexer use the same source.

## Agentic RAG assistant

The assistant uses an Agentic architecture to autonomously decide when to search the local database or query live internet sources:

- **LangChain & LangGraph**: Orchestrates the AI Agent (`create_react_agent`)
- **Model Context Protocol (MCP)**: Connects to the official GitHub MCP server to securely fetch live GitHub repositories, commits, and PRs.
- **ChromaDB**: For the local vector database of resume content
- **`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`**: For advanced multilingual embeddings (supports Hindi, Marathi, etc.)
- **OpenRouter**: For configurable answer generation
- **FastAPI**: For the server-side API

The OpenRouter key and GitHub PAT are never sent to the browser.

### Setup

1. Copy `.env.example` to `.env`.
2. Add your `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and a `GITHUB_PERSONAL_ACCESS_TOKEN` (classic token with `repo` scope).
3. Create a Python environment and install the dependencies:

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r rag/requirements.txt
pip install langchain langchain-openai langchain-core langgraph langchain-mcp-adapters mcp
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
