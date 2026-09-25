"use client";

import { motion } from "framer-motion";
import { SiC, SiPython, SiJavascript, SiHtml5, SiCss, SiMysql, SiPostgresql, SiMongodb, SiGit, SiGithub, SiLinux, SiGooglecolab, SiDocker, SiFastapi } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaJava } from "react-icons/fa";
import { BsDatabase } from "react-icons/bs";
import { skills } from "@/data/portfolio";

const icons = { C: <SiC />, Python: <SiPython />, Java: <FaJava />, SQL: <BsDatabase />, HTML: <SiHtml5 />, CSS: <SiCss />, JavaScript: <SiJavascript />, FastAPI: <SiFastapi />, MySQL: <SiMysql />, PostgreSQL: <SiPostgresql />, MongoDB: <SiMongodb />, Git: <SiGit />, GitHub: <SiGithub />, Linux: <SiLinux />, "VS Code": <VscVscode />, "Google Colab": <SiGooglecolab />, Docker: <SiDocker /> };
const colors = { C: "#111111", Python: "#3776AB", Java: "#7c6f58", SQL: "#5d625d", JavaScript: "#a48a00", HTML: "#E34F26", CSS: "#1572B6", FastAPI: "#008577", MySQL: "#57758a", PostgreSQL: "#4169E1", MongoDB: "#47A248", Git: "#F05032", GitHub: "#171715", Linux: "#171715", "VS Code": "#147acc", "Google Colab": "#d97706", Docker: "#2496ED" };

export default function Skills() {
  const marqueeSkills = [...skills, ...skills];

  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">04 / Toolkit</p>
          <div><h2 className="section-title">Tools I use to make ideas real.</h2><p className="section-subtitle">Move across the toolkit. Every tile is a small snapshot of how the work gets made.</p></div>
        </div>

        <div className="toolkit-marquee" aria-hidden="true"><motion.div className="toolkit-marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}>{marqueeSkills.map((skill, index) => <span key={`${skill.name}-${index}`}><i style={{ color: colors[skill.name] || "var(--ink)" }}>{icons[skill.name]}</i>{skill.name}</span>)}</motion.div></div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.div className="skill-item" key={skill.name} initial={{ opacity: 0, y: 24, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (index % 4) * 0.08, duration: 0.45 }} whileHover={{ y: -8, scale: 1.025 }}>
              <span className="skill-icon" style={{ color: colors[skill.name] || "var(--ink)" }}>{icons[skill.name]}</span>
              <span className="skill-name">{skill.name}</span>
              <span className="skill-category-label">{skill.category}</span>
              <span className="skill-scan-line" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}