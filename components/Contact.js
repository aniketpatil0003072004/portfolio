"use client";
import { motion } from "framer-motion";
import { FiGithub, FiMail, FiPhone } from "react-icons/fi";
import { profile } from "@/data/portfolio";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
          <p className="section-kicker">05 / Contact</p>
          <h2 className="contact-heading">Let&apos;s make something <span>useful.</span></h2>
          <p className="contact-desc">Open to opportunities, collaborations, and interesting problems worth solving.</p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`} className="contact-item"><FiMail /> {profile.email}</a>
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`} className="contact-item"><FiPhone /> {profile.phone}</a>
          </div>
          <div className="social-links">
            <a href={profile.github} target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub"><FiGithub /></a>
          </div>
        </motion.div>
      </div>
      <footer className="footer"><div className="container"><p>© 2026 Aniket Patil </p></div></footer>
    </section>
  );
}
