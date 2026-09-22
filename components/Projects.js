"use client";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { projects } from "@/data/portfolio";

const card = { hidden: { opacity: 0, y: 24 }, visible: (index) => ({ opacity: 1, y: 0, transition: { delay: index * 0.08, duration: .45 } }) };

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">03 / Selected work</p>
          <div>
            <h2 className="section-title">Projects with a purpose.</h2>
            <p className="section-subtitle">A selection of products and systems built across web development, AI, and data.</p>
          </div>
        </div>
        <motion.div className="projects-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {projects.map((project, index) => (
            <motion.article className="project-card" key={project.title} custom={index} variants={card}>
              <div className="project-header">
                <h3>{project.title}</h3>
                {project.github !== "#" ? <a className="project-link" href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}><FiGithub /></a> : <FiArrowUpRight className="project-link" aria-hidden="true" />}
              </div>
              <span className="project-badge">{project.badge}</span>
              <p>{project.desc}</p>
              <div className="project-tags">{project.tech.map((technology) => <span className="tag" key={technology}>{technology}</span>)}</div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
