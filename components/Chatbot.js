"use client";

import { useState } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";

const API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL || "http://127.0.0.1:8000";

const starterQuestions = [
  "Tell me about Aniket",
  "What projects has he built?",
  "Which technologies does he know?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I can answer questions about Aniket's projects, skills, education, and experience.",
    },
  ]);

  async function askQuestion(value) {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setQuestion("");
    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "The selected OpenRouter model is temporarily rate-limited. Please switch to a paid model, add your own provider key in OpenRouter, or try again later."
          );
        }

        throw new Error(
          data.detail ||
            `The chatbot backend returned an error (${response.status}).`
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ||
            "I could not generate an answer from the portfolio information.",
        },
      ]);
    } catch (error) {
      const message = error?.message || "";

      if (
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("networkerror")
      ) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content:
              "I cannot reach the chatbot backend. Make sure FastAPI is running at http://127.0.0.1:8000.",
          },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: message,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  function submitQuestion(event) {
    event.preventDefault();
    askQuestion(question);
  }

  return (
    <div className="chatbot-launcher">
      {open && (
        <section className="chatbot-panel" aria-label="Portfolio assistant">
          <header className="chatbot-header">
            <div className="chatbot-header-copy">
              <div className="chatbot-title-row">
                <span className="chatbot-status-dot" />
                <p>Portfolio assistant</p>
              </div>
              <span>Grounded in Aniket&apos;s portfolio</span>
            </div>

            <button
              type="button"
              className="chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close portfolio assistant"
            >
              <FiX />
            </button>
          </header>

          <div className="chatbot-messages" aria-live="polite">
            {messages.length === 1 && (
              <div className="chatbot-welcome">
                <div className="chatbot-welcome-icon">
                  <FiMessageCircle />
                </div>
                <h2>Ask about the portfolio</h2>
                <p>
                  I can explain projects, skills, education, and professional
                  experience.
                </p>

                <div className="chatbot-starters">
                  {starterQuestions.map((starter) => (
                    <button
                      type="button"
                      key={starter}
                      onClick={() => askQuestion(starter)}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                className={`chatbot-message-row ${message.role}`}
                key={`${message.role}-${index}`}
              >
                <div className={`chatbot-message ${message.role}`}>
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-message-row assistant">
                <div className="chatbot-message assistant chatbot-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <form className="chatbot-form" onSubmit={submitQuestion}>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Message the portfolio assistant..."
              aria-label="Message the portfolio assistant"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              aria-label="Send message"
            >
              <FiSend />
            </button>
          </form>

          <p className="chatbot-disclaimer">
            Answers are based on the portfolio content.
          </p>
        </section>
      )}

      {!open && (
        <button
          type="button"
          className="chatbot-button"
          onClick={() => setOpen(true)}
          aria-label="Open portfolio assistant"
        >
          <FiMessageCircle />
        </button>
      )}
    </div>
  );
}