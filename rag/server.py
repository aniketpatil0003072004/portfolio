"""FastAPI server for multilingual, portfolio-grounded agent-style question answering."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

import chromadb
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parents[1]
# Set cache path inside the project before importing fastembed
os.environ["FASTEMBED_CACHE_PATH"] = str(ROOT / "rag" / "model_cache")
from fastembed import TextEmbedding

from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from langchain_mcp_adapters.tools import load_mcp_tools

load_dotenv(ROOT / ".env")

CHROMA_PATH = ROOT / os.environ["CHROMA_PERSIST_DIRECTORY"]
COLLECTION_NAME = os.environ["CHROMA_COLLECTION"]
EMBEDDING_MODEL = os.environ["EMBEDDING_MODEL"]
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
WHATSAPP_NUMBER = os.environ.get("NEXT_PUBLIC_WHATSAPP_NUMBER", "")
WHATSAPP_URL = f"https://wa.me/{WHATSAPP_NUMBER}"

app = FastAPI(title="Aniket Portfolio Agentic RAG API")
origins = [item.strip() for item in os.environ["FRONTEND_ORIGINS"].split(",") if item.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["GET", "POST"], allow_headers=["*"])

_embedding_model = None
_collection = None


class HistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class Question(BaseModel):
    question: str = Field(min_length=2, max_length=800)
    language: str = Field(default="en", max_length=24)
    history: list[HistoryMessage] = Field(default_factory=list, max_length=8)


def get_collection():
    global _embedding_model, _collection
    if _collection is None:
        if not CHROMA_PATH.exists():
            raise HTTPException(status_code=503, detail="The portfolio index is not built yet. Run python rag/ingest.py first.")
        try:
            _embedding_model = TextEmbedding(model_name=EMBEDDING_MODEL)
            client = chromadb.PersistentClient(path=str(CHROMA_PATH))
            _collection = client.get_collection(name=COLLECTION_NAME)
        except Exception as error:
            raise HTTPException(status_code=503, detail=f"Portfolio index is unavailable: {error}") from error
    return _collection


def detect_intent(question: str) -> str:
    text = question.lower()
    contact_words = ("contact", "hire", "email", "mail", "whatsapp", "reach", "connect", "काम", "संपर्क", "नोकरी")
    project_words = ("project", "projects", "built", "build", "work", "portfolio", "प्रोजेक्ट", "प्रकल्प")
    skill_words = ("skill", "technology", "technologies", "stack", "know", "tech", "कौशल्य", "टेक्नॉलॉजी")
    experience_words = ("experience", "intern", "internship", "education", "study", "degree", "अनुभव", "शिक्षण")
    if any(word in text for word in contact_words):
        return "contact"
    if any(word in text for word in project_words):
        return "projects"
    if any(word in text for word in skill_words):
        return "skills"
    if any(word in text for word in experience_words):
        return "experience"
    return "portfolio"


def action_suggestions(intent: str) -> list[dict]:
    actions = []
    if intent == "contact":
        actions.append({"label": "Chat on WhatsApp", "type": "whatsapp", "href": WHATSAPP_URL})
    else:
        actions.append({"label": "See contact options", "type": "scroll", "target": "contact"})
    if intent in {"portfolio", "projects"}:
        actions.append({"label": "Open projects", "type": "scroll", "target": "projects"})
    return actions


@tool
def search_portfolio(query: str) -> str:
    """Use this tool to search Aniket's resume, skills, experience, and past projects. Use it whenever asked about Aniket."""
    collection = get_collection()
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = TextEmbedding(model_name=EMBEDDING_MODEL)
    query_embedding = [list(_embedding_model.embed([query]))[0].tolist()]
    result = collection.query(query_embeddings=query_embedding, n_results=6, include=["documents"])
    documents = result.get("documents", [[]])[0]
    if not documents:
        return "No relevant information found in the portfolio."
    return "\n\n".join(documents)


def get_agent_executor(mcp_tools=None):
    if mcp_tools is None:
        mcp_tools = []
        
    api_key = os.getenv("OPENROUTER_API_KEY")
    model = os.getenv("OPENROUTER_MODEL")
    if not api_key or not model:
        raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY or OPENROUTER_MODEL missing.")

    # We use LangChain's ChatOpenAI wrapper to talk to OpenRouter
    llm = ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        default_headers={"HTTP-Referer": os.environ.get("SITE_URL", "http://localhost:3000"), "X-Title": "Aniket Agent"},
        temperature=0.2
    )
    
    tools = [search_portfolio] + mcp_tools
    agent = create_react_agent(llm, tools=tools)
    return agent


@app.get("/health")
def health():
    return {"ok": True, "indexed": CHROMA_PATH.exists(), "embedding_model": EMBEDDING_MODEL}


@app.post("/chat")
async def chat(payload: Question):
    question = payload.question.strip()
    intent = detect_intent(question)
    
    # Format chat history for LangChain
    system_message = SystemMessage(content="You are the autonomous portfolio AI for Aniket Patil. You have access to tools. ALWAYS use the search_portfolio tool to look up facts before answering questions about Aniket's background. You also have GitHub tools. Do not guess. Be concise and warm.")
    langchain_history = [system_message]
    
    for msg in payload.history[-6:]:
        if msg.role == "user":
            langchain_history.append(HumanMessage(content=msg.content))
        else:
            langchain_history.append(AIMessage(content=msg.content))
            
    try:
        # Instantiate agent with just the portfolio tool for instant responses
        executor = get_agent_executor([])
        response = await executor.ainvoke({
            "messages": langchain_history + [HumanMessage(content=question)]
        })
        answer = response["messages"][-1].content
    except Exception as e:
        print("AGENT ERROR:", str(e))
        raise HTTPException(status_code=502, detail=f"Agent error: {str(e)}")
    
    return {
        "answer": answer,
        "sources": [{"title": "Portfolio Tool", "section": "portfolio"}],
        "intent": intent,
        "suggested_actions": action_suggestions(intent),
        "agent_steps": ["Invoked LangChain Agent", "Decided to use tool or answer directly", "Generated response"],
    }