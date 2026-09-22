"use client";
import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="section-head"><p className="section-kicker">02 / Experience</p><div><h2 className="section-title">Learning by building in the real world.</h2><p className="section-subtitle">Professional experience across backend development, AI, OCR </p></div></div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5 }}>
          <div className="exp-header"><h3 className="exp-role">{experience.role}</h3><p className="exp-company">{experience.company}</p><p className="exp-duration">{experience.duration}</p></div>
          <p className="exp-desc">{experience.description}</p>
          <p className="exp-projects-title">Internship projects</p>
          <div className="exp-projects-grid">{experience.projects.map((project) => <article className="exp-project-card" key={project.title}><h4>{project.title}</h4><p>{project.desc}</p></article>)}</div>
          <div className="exp-skills-wrap"><p className="exp-skills-label">Skills used</p><div className="skill-tags">{experience.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div></div>
        </motion.div>
      </div>
    </section>
  );
}
