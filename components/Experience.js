"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiArrowUpRight, FiCpu, FiFileText, FiHeadphones, FiMessageCircle } from "react-icons/fi";
import { SiDocker, SiFastapi, SiGit, SiGithub, SiPostman, SiPython, SiSwagger } from "react-icons/si";
import { experience } from "@/data/portfolio";

const toolIcons = {
  Python: <SiPython />,
  Git: <SiGit />,
  GitHub: <SiGithub />,
  Postman: <SiPostman />,
  OCR: <FiFileText />,
  FastAPI: <SiFastapi />,
  Docker: <SiDocker />,
  LLM: <FiCpu />,
  "Audio Processing": <FiHeadphones />,
  "Swagger Editor": <SiSwagger />,
};

const projectKinds = ["Document intelligence", "Developer tooling", "Language technology"];

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = experience.projects[activeIndex];

  function askAboutProject() {
    window.dispatchEvent(new CustomEvent("open-portfolio-chat", {
      detail: { question: `Tell me more about ${activeProject.title}` },
    }));
  }

  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">02 / Experience</p>
          <div>
            <h2 className="section-title">Learning by building in the real world.</h2>
            <p className="section-subtitle">Click each build to open its story. Follow the moving line through the work.</p>
          </div>
        </div>

        <motion.div className="experience-role-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
          <div>
            <p className="experience-kicker">Current chapter</p>
            <h3 className="exp-role">{experience.role}</h3>
            <p className="exp-company">{experience.company}</p>
          </div>
          <p className="exp-duration">{experience.duration}</p>
          <p className="exp-desc">{experience.description}</p>
        </motion.div>

        <div className="experience-interactive">
          <div className="experience-timeline" aria-label="Internship projects">
            <span className="experience-rail" />
            <motion.span className="experience-snake" animate={{ top: `${activeIndex * (100 / Math.max(experience.projects.length, 1))}%` }} transition={{ type: "spring", stiffness: 140, damping: 18 }} />
            {experience.projects.map((project, index) => (
              <motion.button
                type="button"
                className={`experience-project-button ${index === activeIndex ? "active" : ""}`}
                key={project.title}
                onClick={() => setActiveIndex(index)}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.12, duration: 0.45 }}
                aria-pressed={index === activeIndex}
              >
                <span className="experience-node"><span /></span>
                <span className="experience-project-copy"><small>0{index + 1} · {projectKinds[index] || "Project build"}</small><strong>{project.title}</strong><span>{index === activeIndex ? "Selected · click to view details" : "Click to explore"}</span></span>
                <FiArrowUpRight className="experience-project-arrow" />
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.article className="experience-detail" key={activeProject.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className="experience-detail-topline"><span>Selected build</span><span>0{activeIndex + 1} / {experience.projects.length}</span></div>
              <h3>{activeProject.title}</h3>
              <p>{activeProject.desc}</p>
              <div className="experience-detail-divider" />
              <p className="experience-detail-label">Skills used across this role</p>
              <div className="experience-tools">
                {experience.skills.map((skill, index) => <span className="experience-tool" key={skill}><span className="experience-tool-icon">{toolIcons[skill] || <FiCpu />}</span>{skill}</span>)}
              </div>
              <button type="button" className="experience-ask" onClick={askAboutProject}><FiMessageCircle /> Ask the portfolio AI about this <FiArrowUpRight /></button>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}