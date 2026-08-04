"use client";
import { motion } from "framer-motion";

const internProjects = [
  {
    title: "OCR Document Analysis System",
    desc: "Built a tool that processes images of documents using OCR, organizes extracted data, and exports it to Excel for analysis and reporting.",
  },
  {
    title: "Local Coding Agent",
    desc: "Developed a locally-running coding agent that leverages local GPU resources to generate, review, and execute code autonomously.",
  },
  {
    title: "Audio Translator",
    desc: "Built an audio translation system supporting ~15 languages that transcribes input audio and generates translated audio output.",
  },
];

const internSkills = [
  "Python", "Git", "GitHub", "Postman", "OCR", "FastAPI",
  "Docker", "LLM", "Audio Processing", "Swagger Editor",
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">Professional work and internship experience.</p>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          style={{ cursor: "default" }}
          whileHover={{ y: -4, boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
        >
          <div className="exp-header">
            <h3 className="exp-role">Software Development Intern</h3>
            <p className="exp-company">LogicBrackets Private Limited</p>
            <p className="exp-duration">January 2026 – July 2026</p>
          </div>

          <p className="exp-desc">
            Worked on backend development and contributed to building scalable
            web applications and APIs. Delivered multiple production-ready
            intern projects involving AI, OCR, and audio processing.
          </p>

          <p className="exp-projects-title">Internship Projects</p>

          <motion.div
            className="exp-projects-grid"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {internProjects.map((proj) => (
              <motion.div className="glass-card exp-project-card" key={proj.title} variants={card}>
                <h4>{proj.title}</h4>
                <p>{proj.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="exp-skills-wrap">
            <p className="exp-skills-label">Skills Used</p>
            <div className="skill-tags">
              {internSkills.map((s) => (
                <span className="tag" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
