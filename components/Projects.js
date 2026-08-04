"use client";
import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";

const projects = [
  {
    title: "Smart Mess Finder",
    badge: "Startup",
    desc: "Web platform for users to find nearby messes, view menus, choose plans, and submit payments. Tested by 10+ messes during testing phase.",
    tech: ["TypeScript", "React.js", "PostgreSQL", "Tailwind CSS", "Vite", "Supabase"],
    github: "#",
  },
  {
    title: "Vaultify",
    badge: "PWA",
    desc: "Intelligent digital asset vault with AI-powered automation for video metadata extraction, biometric face authentication, and client-side AES encryption.",
    tech: ["React", "Vite", "Supabase", "Gemini API", "Web Crypto API"],
    github: "#",
  },
  {
    title: "Exam Slot Allocation System",
    badge: "In Use",
    desc: "AI-powered exam management platform with automated room allocation using Firebase for real-time data. Currently being tested by 20+ faculty members.",
    tech: ["React.js", "Firebase Firestore", "Gemini API"],
    github: "#",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">Some things I&apos;ve built recently.</p>
        </motion.div>

        <motion.div
          className="projects-grid"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {projects.map((proj) => (
            <motion.div className="glass-card project-card" key={proj.title} variants={card}>
              <div className="project-header">
                <h3>{proj.title}</h3>
                <a href={proj.github} className="project-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FiGithub />
                </a>
              </div>
              <span className="project-badge">{proj.badge}</span>
              <p>{proj.desc}</p>
              <div className="project-tags">
                {proj.tech.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
