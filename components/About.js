"use client";
import { motion } from "framer-motion";
import { education } from "@/data/portfolio";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">01 / About</p>
          <div>
            <h2 className="section-title">Curious about systems, thoughtful about people.</h2>
            <p className="section-subtitle">A student builder passionate about the intersection of data, AI, and scalable software engineering.</p>
          </div>
        </div>
        <div className="about-content">
          <motion.div className="about-text" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .5 }}>
            <p>As a Computer Science & Engineering student, I am deeply curious about how data-driven systems can solve real-world problems. Whether I am architecting a database schema, developing a full-stack platform, or integrating machine learning models, my goal is to engineer tools that don't just work—but actually empower people.</p>
            <p>I thrive on continuous learning and collaborative problem-solving. By actively experimenting with emerging technologies, I aim to translate complex technical challenges into intuitive, high-performance applications.</p>
          </motion.div>
          <div className="education-timeline">
            {education.map((item) => <div className="edu-item" key={item.degree}><h4>{item.degree}</h4><p className="edu-school">{item.school}</p><p className="edu-meta">{item.meta}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
