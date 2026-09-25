"""Build or rebuild the local multilingual ChromaDB index from portfolio content."""
from __future__ import annotations

import json
import os
from pathlib import Path

import chromadb
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

DATA_PATH = ROOT / "data" / "portfolio.json"
CHROMA_PATH = ROOT / os.environ["CHROMA_PERSIST_DIRECTORY"]
COLLECTION_NAME = os.environ["CHROMA_COLLECTION"]
EMBEDDING_MODEL = os.environ["EMBEDDING_MODEL"]


def build_documents(data: dict) -> tuple[list[str], list[dict], list[str]]:
    documents: list[str] = []
    metadatas: list[dict] = []
    ids: list[str] = []

    def add(doc_id: str, title: str, content: str, section: str):
        documents.append(content.strip())
        metadatas.append({"title": title, "section": section, "source": "data/portfolio.json"})
        ids.append(doc_id)

    profile = data["profile"]
    add("profile", "Profile", f"Name: {profile['name']}\nRole: {profile['label']}\nIntroduction: {profile['intro']}\nEmail: {profile['email']}\nPhone: {profile['phone']}\nGitHub: {profile['github']}", "profile")

    for index, item in enumerate(data.get("education", [])):
        add(f"education-{index}", item["degree"], f"Degree: {item['degree']}\nInstitution: {item['school']}\nDetails: {item['meta']}", "education")

    for index, project in enumerate(data.get("projects", [])):
        tech = ", ".join(project.get("tech", []))
        add(f"project-{index}", project["title"], f"Project: {project['title']}\nStatus: {project['badge']}\nDescription: {project['desc']}\nTechnologies: {tech}", "projects")

    grouped: dict[str, list[str]] = {}
    for skill in data.get("skills", []):
        grouped.setdefault(skill["category"], []).append(skill["name"])
    for category, names in grouped.items():
        add(f"skills-{category.lower()}", f"{category} skills", f"{category}: {', '.join(names)}", "skills")

    experience = data["experience"]
    add("experience", f"{experience['role']} at {experience['company']}", f"Role: {experience['role']}\nCompany: {experience['company']}\nDuration: {experience['duration']}\nDescription: {experience['description']}\nSkills used: {', '.join(experience['skills'])}", "experience")
    for index, project in enumerate(experience.get("projects", [])):
        add(f"internship-project-{index}", project["title"], f"Internship project: {project['title']}\nDescription: {project['desc']}\nContext: Built during the {experience['role']} at {experience['company']}.", "experience")

    return documents, metadatas, ids


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    documents, metadatas, ids = build_documents(data)
    CHROMA_PATH.mkdir(parents=True, exist_ok=True)
    model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings = model.encode(documents, normalize_embeddings=True).tolist()
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    collection = client.get_or_create_collection(name=COLLECTION_NAME)
    collection.add(ids=ids, documents=documents, metadatas=metadatas, embeddings=embeddings)
    print(f"Indexed {len(documents)} portfolio documents with {EMBEDDING_MODEL} into {CHROMA_PATH}.")


if __name__ == "__main__":
    main()