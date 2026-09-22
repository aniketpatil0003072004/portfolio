"use client";

import { useState } from "react";
import {
  FiMessageCircle,
  FiPhone,
  FiSend,
  FiX,
} from "react-icons/fi";

const API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL || "http://127.0.0.1:8000";

const WHATSAPP_NUMBER = "916360482752";

const WHATSAPP_MESSAGE =
  "Hi Aniket, I found your portfolio and would like to connect.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

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

    // Start measuring the complete browser-to-backend-to-AI response time.
    const requestStartedAt = performance.now();

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
            "The selected OpenRouter model is temporarily rate-limited. Please try again later or use another model."
          );
        }

        throw new Error(
          data.detail ||
            `The chatbot backend returned an error (${response.status}).`
        );
      }

      const requestFinishedAt = performance.now();
      const latencySeconds = (
        (requestFinishedAt - requestStartedAt) /
        1000
      ).toFixed(2);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ||
            "I could not generate an answer from the portfolio information.",
          latency: latencySeconds,
        },
      ]);
    } catch (error) {
      const errorMessage = error?.message || "";

      if (
        errorMessage.toLowerCase().includes("failed to fetch") ||
        errorMessage.toLowerCase().includes("networkerror")
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
            content: errorMessage,
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
        <section
          className="chatbot-panel"
          aria-label="Portfolio assistant"
        >
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

                <div className="chatbot-contact-divider">
                  <span>or contact directly</span>
                </div>

                <a
                  className="chatbot-whatsapp"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="chatbot-whatsapp-icon">
                    <FiPhone />
                  </span>

                  <span className="chatbot-whatsapp-copy">
                    <strong>Chat on WhatsApp</strong>
                    <small>Contact Aniket directly</small>
                  </span>
                </a>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                className={`chatbot-message-row ${message.role}`}
                key={`${message.role}-${index}`}
              >
                <div className={`chatbot-message ${message.role}`}>
                  {message.content}

                  {message.role === "assistant" && message.latency && (
                    <small
                      style={{
                        display: "block",
                        marginTop: "8px",
                        color: "#a7a59c",
                        fontFamily: "var(--mono)",
                        fontSize: "0.58rem",
                        lineHeight: 1.4,
                      }}
                    >
                      Response time: {message.latency} seconds
                    </small>
                  )}
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

          <form
            className="chatbot-form"
            onSubmit={submitQuestion}
          >
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