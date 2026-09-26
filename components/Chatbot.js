"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiMessageCircle,
  FiPhone,
  FiRefreshCw,
  FiSend,
  FiX,
  FiZap,
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_RAG_API_URL || "http://127.0.0.1:8000";
const WHATSAPP_NUMBER = "916360482752";
const WHATSAPP_MESSAGE = "Hi Aniket, I found your portfolio and would like to connect.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const starterQuestions = [
  "Give me a quick tour of his work",
  "Which project is best for an AI role?",
  "What technologies does he use?",
];

const initialMessage = {
  role: "assistant",
  content: "Hi! I am Aniket's portfolio AI. Ask me about his projects, skills, education, or experience — I can also guide you to contact him.",
  actions: [
    { label: "View contact options", type: "scroll", target: "contact" },
    { label: "Chat on WhatsApp", type: "whatsapp", href: WHATSAPP_URL },
  ],
};

function getBrowserLanguage() {
  if (typeof navigator === "undefined") return "en";
  return navigator.language || "en";
}

export default function Chatbot() {
  const messagesRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [showLatestButton, setShowLatestButton] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);

  useEffect(() => {
    const openChat = (event) => {
      setOpen(true);
      setShowTeaser(false);
      if (event.detail?.question) setQuestion(event.detail.question);
    };

    window.addEventListener("open-portfolio-chat", openChat);
    return () => window.removeEventListener("open-portfolio-chat", openChat);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (open && panelRef.current && !panelRef.current.contains(event.target)) {
        closeChat();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const element = messagesRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function closeChat() {
    setOpen(false);
    setShowTeaser(true);
  }

  function resetChat() {
    setMessages([initialMessage]);
    setQuestion("");
    setShowLatestButton(false);
  }

  function scrollToLatest() {
    const element = messagesRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    setShowLatestButton(false);
  }

  function handleMessagesScroll(event) {
    const element = event.currentTarget;
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    setShowLatestButton(distanceFromBottom > 120);
  }

  function runAction(action) {
    if (action.type === "whatsapp") return;
    if (action.type === "scroll" && action.target) {
      closeChat();
      document.getElementById(action.target)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function askQuestion(value) {
    const trimmedQuestion = value.trim();
    if (!trimmedQuestion || loading) return;

    setQuestion("");
    setMessages((current) => [...current, { role: "user", content: trimmedQuestion }]);
    setLoading(true);
    const requestStartedAt = performance.now();

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedQuestion,
          language: getBrowserLanguage(),
          history: messages.slice(-6).map(({ role, content }) => ({ role, content })),
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 429) throw new Error("The AI model is temporarily rate-limited. Please try again shortly.");
        throw new Error(data.detail || `The chatbot backend returned an error (${response.status}).`);
      }

      const latencySeconds = ((performance.now() - requestStartedAt) / 1000).toFixed(2);
      setMessages((current) => [...current, {
        role: "assistant",
        content: data.answer || "I could not generate an answer from the portfolio information.",
        latency: latencySeconds,
        sources: data.sources || [],
        actions: data.suggested_actions || [],
        intent: data.intent,
      }]);
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong.";
      setMessages((current) => [...current, {
        role: "assistant",
        content: errorMessage.toLowerCase().includes("failed to fetch")
          ? "I cannot reach the portfolio AI backend. Start FastAPI at http://127.0.0.1:8000 and try again."
          : errorMessage,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function submitQuestion(event) {
    event.preventDefault();
    askQuestion(question);
  }

  function handleComposerKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion(question);
    }
  }

  function handleComposerChange(event) {
    setQuestion(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
  }

  const conversationMessages = messages.length === 1 ? [] : messages;

  return (
    <div className="chatbot-launcher">
      <AnimatePresence>
        {!open && showTeaser && (
          <motion.div className="mascot-teaser-container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
            <img src="/mascot.png" alt="Aniket Patil" className="mascot-image" onClick={() => { setOpen(true); setShowTeaser(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {open ? (
          <motion.section ref={panelRef} key="panel" className="chatbot-panel" aria-label="Portfolio assistant" initial={{ opacity: 0, y: 24, scale: 0.94, transformOrigin: "bottom right" }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={{ type: "spring", stiffness: 280, damping: 25 }}>
            <header className="chatbot-header">
              <div className="chatbot-header-copy">
                <div className="chatbot-title-row"><span className="chatbot-status-dot" /><p>Portfolio AI</p></div>
                <span><FiZap /> multilingual · grounded</span>
              </div>
              <div className="chatbot-header-actions">
                <a className="chatbot-whatsapp-header-btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <FiPhone /><span>WhatsApp</span>
                </a>
                <button type="button" className="chatbot-new-chat" onClick={resetChat}><FiRefreshCw /><span>New chat</span></button>
                <button type="button" className="chatbot-close" onClick={closeChat} aria-label="Close portfolio assistant"><FiX /></button>
              </div>
            </header>



            <div ref={messagesRef} className="chatbot-messages" aria-live="polite" onScroll={handleMessagesScroll}>
              {messages.length === 1 && (
                <motion.div className="chatbot-welcome chatbot-welcome-clean" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="chatbot-welcome-icon"><FiMessageCircle /></div>
                  <p className="chatbot-welcome-eyebrow">A guided tour of the portfolio</p>
                  <h2>What would you like to explore?</h2>
                  <p>Ask in your own words. I can explain the work, find relevant technologies, and guide you to the right next step.</p>
                  <div className="chatbot-welcome-actions">
                    {initialMessage.actions.map((action) => action.type === "whatsapp" ? <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">{action.label}<FiPhone /></a> : <button key={action.label} type="button" onClick={() => runAction(action)}>{action.label}<FiArrowUpRight /></button>)}
                  </div>
                </motion.div>
              )}

              {conversationMessages.map((message, index) => (
                <motion.div className={`chatbot-message-row ${message.role}`} key={`${message.role}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  {message.role === "assistant" && (
                    <div className="chatbot-avatar"><FiZap /></div>
                  )}
                  <div className={`chatbot-message ${message.role}`}>
                    <span>{message.content}</span>
                    {message.role === "assistant" && message.intent && <small className="chatbot-intent">Route: {message.intent}</small>}
                    {message.role === "assistant" && message.sources?.length > 0 && <small className="chatbot-sources">Based on: {message.sources.slice(0, 3).map((source) => source.title).join(" · ")}</small>}
                    {message.role === "assistant" && message.latency && <small className="chatbot-latency">Response time: {message.latency} seconds</small>}
                    {message.role === "assistant" && message.actions?.length > 0 && <div className="chatbot-actions">{message.actions.map((action) => action.type === "whatsapp" ? <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">{action.label}<FiPhone /></a> : <button key={action.label} type="button" onClick={() => runAction(action)}>{action.label}<FiArrowUpRight /></button>)}</div>}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="chatbot-message-row assistant">
                  <div className="chatbot-avatar"><FiZap /></div>
                  <div className="chatbot-message assistant chatbot-typing"><span /><span /><span /></div>
                </div>
              )}
            </div>

            {showLatestButton && <button type="button" className="chatbot-latest" onClick={scrollToLatest}>↓ Latest message</button>}

            <div className="chatbot-suggested-bar">
              <span>Try asking</span>
              <div>{starterQuestions.map((starter) => <button type="button" key={starter} onClick={() => askQuestion(starter)} disabled={loading}>{starter}<FiArrowUpRight /></button>)}</div>
            </div>

            <form className="chatbot-form" onSubmit={submitQuestion}>
              <div className="chatbot-composer">
                <textarea value={question} onChange={handleComposerChange} onKeyDown={handleComposerKeyDown} placeholder="Message the portfolio AI..." aria-label="Message the portfolio assistant" disabled={loading} rows={1} />
                <button type="submit" disabled={loading || !question.trim()} aria-label="Send message"><FiSend /></button>
              </div>
              <small className="chatbot-composer-hint">Enter to send · Shift + Enter for a new line</small>
            </form>
            <p className="chatbot-disclaimer">Portfolio-grounded answers · no invented details</p>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}