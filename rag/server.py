"""FastAPI server for portfolio question answering through ChromaDB and OpenRouter."""
from __future__ import annotations

import os
from pathlib import Path

import chromadb
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

CHROMA_PATH = ROOT / os.getenv(
    "CHROMA_PERSIST_DIRECTORY",
    "rag/chroma_data",
)
COLLECTION_NAME = os.getenv(
    "CHROMA_COLLECTION",
    "portfolio-content",
)
EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2",
)

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

app = FastAPI(title="Aniket Portfolio RAG API")

origins = [
    item.strip()
    for item in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if item.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_embedding_model = None
_collection = None


class Question(BaseModel):
    question: str = Field(min_length=2, max_length=800)


def get_collection():
    global _embedding_model, _collection

    if _collection is None:
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)

        client = chromadb.PersistentClient(
            path=str(CHROMA_PATH),
        )

        _collection = client.get_collection(
            name=COLLECTION_NAME,
        )

    return _collection


def call_openrouter(
    model: str,
    system_prompt: str,
    user_prompt: str,
):
    api_key = os.getenv("OPENROUTER_API_KEY")

    payload = {
        "model": model,
        "temperature": 0.2,
        "max_tokens": 450,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    }

    return requests.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": os.getenv(
                "SITE_URL",
                "http://localhost:3000",
            ),
            "X-Title": "Aniket Patil Portfolio",
        },
        json=payload,
        timeout=60,
    )


def answer_with_openrouter(
    question: str,
    context: list[str],
):
    api_key = os.getenv("OPENROUTER_API_KEY")
    primary_model = os.getenv("OPENROUTER_MODEL")
    fallback_model = os.getenv("OPENROUTER_FALLBACK_MODEL", "").strip()

    if not api_key or not primary_model:
        raise HTTPException(
            status_code=503,
            detail=(
                "OpenRouter is not configured. Add "
                "OPENROUTER_API_KEY and OPENROUTER_MODEL to .env."
            ),
        )

    numbered_context = "\n\n".join(
        f"[{index + 1}] {item}"
        for index, item in enumerate(context)
    )

    system_prompt = """
You are the assistant for Aniket Patil's portfolio.

Answer only using the supplied portfolio context.

Do not invent projects, technologies, dates, employers, results,
contact details, education, or experience.

If the answer is not present in the context, say:
"That information is not mentioned in the portfolio."

Keep the answer concise, clear, and helpful.
"""

    user_prompt = (
        f"Portfolio context:\n{numbered_context}\n\n"
        f"Visitor question: {question}"
    )

    response = call_openrouter(
        primary_model,
        system_prompt,
        user_prompt,
    )

    if response.status_code == 429 and fallback_model:
        response = call_openrouter(
            fallback_model,
            system_prompt,
            user_prompt,
        )

    if response.status_code == 429:
        raise HTTPException(
            status_code=429,
            detail=(
                "The selected OpenRouter model is temporarily "
                "rate-limited. Switch to a paid model, add a provider "
                "key in OpenRouter Integrations, or retry later."
            ),
        )

    if not response.ok:
        raise HTTPException(
            status_code=502,
            detail=(
                "OpenRouter returned an error. "
                f"Provider response: {response.text[:300]}"
            ),
        )

    body = response.json()

    try:
        return body["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError):
        raise HTTPException(
            status_code=502,
            detail="OpenRouter returned an unexpected response.",
        )


@app.get("/health")
def health():
    return {
        "ok": True,
        "indexed": CHROMA_PATH.exists(),
    }


@app.post("/chat")
def chat(payload: Question):
    question = payload.question.strip()
    collection = get_collection()

    query_embedding = _embedding_model.encode(
        [question],
        normalize_embeddings=True,
    ).tolist()

    result = collection.query(
        query_embeddings=query_embedding,
        n_results=6,
        include=[
            "documents",
            "metadatas",
            "distances",
        ],
    )

    documents = result.get("documents", [[]])[0]

    if not documents:
        return {
            "answer": "That information is not mentioned in the portfolio.",
            "sources": [],
        }

    answer = answer_with_openrouter(
        question,
        documents,
    )

    return {
        "answer": answer,
        "sources": result.get("metadatas", [[]])[0],
    }