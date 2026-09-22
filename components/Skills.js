"use client";
import { motion } from "framer-motion";
import { SiC, SiPython, SiJavascript, SiHtml5, SiCss, SiMysql, SiPostgresql, SiMongodb, SiGit, SiGithub, SiLinux, SiGooglecolab, SiDocker, SiFastapi } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaJava } from "react-icons/fa";
import { BsDatabase } from "react-icons/bs";
import { skills } from "@/data/portfolio";

const icons = { C: <SiC />, Python: <SiPython />, Java: <FaJava />, SQL: <BsDatabase />, HTML: <SiHtml5 />, CSS: <SiCss />, JavaScript: <SiJavascript />, FastAPI: <SiFastapi />, MySQL: <SiMysql />, PostgreSQL: <SiPostgresql />, MongoDB: <SiMongodb />, Git: <SiGit />, GitHub: <SiGithub />, Linux: <SiLinux />, "VS Code": <VscVscode />, "Google Colab": <SiGooglecolab />, Docker: <SiDocker /> };
const colors = { Python: "#3776AB", JavaScript: "#b59b00", HTML: "#E34F26", CSS: "#1572B6", FastAPI: "#008577", PostgreSQL: "#4169E1", MongoDB: "#47A248", Git: "#F05032", Docker: "#2496ED" };

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-head"><p className="section-kicker">04 / Toolkit</p><div><h2 className="section-title">Tools I use to make ideas real.</h2><p className="section-subtitle">Languages, frameworks, databases, and tools from the current portfolio.</p></div></div>
        <div className="skills-grid">
          {skills.map((skill, index) => <motion.div className="skill-item" key={skill.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .025 }}><span className="skill-icon" style={{ color: colors[skill.name] || "var(--ink)", fontSize: "1.35rem" }}>{icons[skill.name]}</span><span className="skill-name">{skill.name}</span><span className="skill-category-label">{skill.category}</span></motion.div>)}
        </div>
      </div>
    </section>
  );
}
