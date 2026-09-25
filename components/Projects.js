"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiGithub, FiX } from "react-icons/fi";
import { projects } from "@/data/portfolio";

const card = {
  hidden: { opacity: 0, y: 34 },
  visible: (index) => ({ opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.55, ease: "easeOut" } }),
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setSelectedProject(null);
    }
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <>
      <section className="projects" id="projects">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">03 / Selected work</p>
            <div>
              <h2 className="section-title">Projects with a purpose.</h2>
              <p className="section-subtitle">Tap a sentence to open the full story, technologies, and build context.</p>
            </div>
          </div>

          <motion.div className="projects-list" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            {projects.map((project, index) => (
              <motion.button className="project-sentence" type="button" key={project.title} custom={index} variants={card} onClick={() => setSelectedProject(project)}>
                <span className="project-number">0{index + 1}</span>
                <span className="project-sentence-copy">
                  <span className="project-sentence-title">{project.title}</span>
                  <span className="project-sentence-description"> — {project.desc}</span>
                  <span className="project-sentence-meta">{project.badge} · {project.tech.slice(0, 3).join(" · ")}</span>
                </span>
                <FiArrowUpRight className="project-sentence-arrow" />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div className="project-modal-backdrop" role="presentation" onClick={() => setSelectedProject(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ type: "spring", stiffness: 280, damping: 25 }}>
              <div className="project-modal-topline"><span>{selectedProject.badge}</span><button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details"><FiX /></button></div>
              <p className="section-kicker">Project detail</p>
              <h2 id="project-modal-title">{selectedProject.title}</h2>
              <p className="project-modal-description">{selectedProject.desc}</p>
              <div className="project-modal-section"><p className="project-modal-label">Toolkit</p><div className="project-tags">{selectedProject.tech.map((technology) => <span className="tag" key={technology}>{technology}</span>)}</div></div>
              <div className="project-modal-footer">
                <button type="button" className="btn-outline" onClick={() => { setSelectedProject(null); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>Discuss a similar idea <FiArrowUpRight /></button>
                {selectedProject.github !== "#" && <a className="btn-primary" href={selectedProject.github} target="_blank" rel="noreferrer">Open GitHub <FiGithub /></a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}