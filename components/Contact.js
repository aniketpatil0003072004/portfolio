"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiCheck, FiGithub, FiMail, FiPhone, FiSend } from "react-icons/fi";
import { profile } from "@/data/portfolio";

const WHATSAPP_NUMBER = "916360482752";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Aniket, I found your portfolio and would like to connect.")}`;

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Sending your note…" });

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus({ type: "error", message: "EmailJS is not configured yet. You can use the email or WhatsApp buttons below." });
      return;
    }

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
            to_name: profile.name,
            reply_to: form.email,
          },
        }),
      });

      if (!response.ok) throw new Error("EmailJS request failed");
      setForm(initialForm);
      setStatus({ type: "success", message: "Message sent. Thanks — Aniket can get back to you soon." });
    } catch {
      setStatus({ type: "error", message: "The message could not be sent. Please use email or WhatsApp below." });
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container contact-layout">
        <motion.div className="contact-copy" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
          <p className="section-kicker">05 / Contact</p>
          <h2 className="contact-heading">Let&apos;s make something <span>useful.</span></h2>
          <p className="contact-desc">Have a project, opportunity, or idea? Send a short note, email directly, or start a WhatsApp conversation.</p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`} className="contact-item"><FiMail /> {profile.email}</a>
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`} className="contact-item"><FiPhone /> {profile.phone}</a>
          </div>
          <div className="contact-quick-actions">
            <a className="contact-quick whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><FiPhone /><span><strong>WhatsApp</strong><small>Quick direct chat</small></span></a>
            <a className="contact-quick" href={profile.github} target="_blank" rel="noreferrer"><FiGithub /><span><strong>GitHub</strong><small>See the code</small></span></a>
          </div>
        </motion.div>

        <motion.form className="contact-form" onSubmit={submitForm} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="contact-form-label">Send a message</p>
          <label><span>Your name</span><input name="name" value={form.name} onChange={updateField} required placeholder="Your name" /></label>
          <label><span>Email address</span><input name="email" type="email" value={form.email} onChange={updateField} required placeholder="you@example.com" /></label>
          <label><span>Message</span><textarea name="message" value={form.message} onChange={updateField} required rows={5} placeholder="What would you like to build?" /></label>
          <button className="btn-primary contact-submit" type="submit" disabled={status.type === "loading"}>{status.type === "loading" ? "Sending…" : <>Send message <FiSend /></>}</button>
          {status.type !== "idle" && <p className={`contact-status ${status.type}`}>{status.type === "success" && <FiCheck />} {status.message}</p>}
        </motion.form>
      </div>
      <footer className="footer"><div className="container"><p>© 2026 Aniket Patil · Portfolio AI included</p></div></footer>
    </section>
  );
}