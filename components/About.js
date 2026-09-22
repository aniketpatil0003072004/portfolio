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
            <p className="section-subtitle">A student builder exploring AI, web development, backend systems, and databases.</p>
          </div>
        </div>
        <div className="about-content">
          <motion.div className="about-text" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .5 }}>
            <p>I am a passionate Computer Science and Engineering student with a strong interest in AI, Web Development, and Database systems. I enjoy turning complex ideas into simple, useful solutions.</p>
            <p>As a problem-solver, I thrive in collaborative environments and keep learning new technologies while building user-centred applications for real-world problems.</p>
          </motion.div>
          <div className="education-timeline">
            {education.map((item) => <div className="edu-item" key={item.degree}><h4>{item.degree}</h4><p className="edu-school">{item.school}</p><p className="edu-meta">{item.meta}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
