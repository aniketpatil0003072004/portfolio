"use client";
import { motion } from "framer-motion";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="contact-heading">
            Let&apos;s <span>Work Together</span>
          </h2>
          <p className="contact-desc">
            I&apos;m always open to new opportunities, collaborations, and interesting projects. Feel free to reach out!
          </p>

          <div className="contact-links">
            <a href="mailto:anipatil0307@gmail.com" className="contact-item">
              <FiMail /> anipatil0307@gmail.com
            </a>
            <a href="tel:+916360482752" className="contact-item">
              <FiPhone /> +91-6360482752
            </a>
          </div>

          <div className="social-links">
            <a
              href="https://linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </motion.div>
      </div>

      <footer className="footer">
        <p>© 2026 Aniket Patil.All rights reserved.</p>
      </footer>
    </section>
  );
}
