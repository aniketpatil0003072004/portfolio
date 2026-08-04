"use client";
import { motion } from "framer-motion";
import {
  SiC, SiPython, SiJavascript, SiHtml5, SiCss,
  SiMysql, SiPostgresql, SiMongodb, SiGit, SiGithub,
  SiLinux, SiGooglecolab, SiDocker,
  SiFastapi,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaJava } from "react-icons/fa";
import { BsDatabase } from "react-icons/bs";

const skills = [
  { name: "C", icon: <SiC />, category: "Languages", color: "#A8B9CC" },
  { name: "Python", icon: <SiPython />, category: "Languages", color: "#3776AB" },
  { name: "Java", icon: <FaJava />, category: "Languages", color: "#f89820" },
  { name: "SQL", icon: <BsDatabase />, category: "Languages", color: "#e48e00" },
  { name: "HTML", icon: <SiHtml5 />, category: "Web Dev", color: "#E34F26" },
  { name: "CSS", icon: <SiCss />, category: "Web Dev", color: "#1572B6" },
  { name: "JavaScript", icon: <SiJavascript />, category: "Web Dev", color: "#F7DF1E" },
  { name: "FastAPI", icon: <SiFastapi />, category: "Web Dev", color: "#009688" },
  { name: "MySQL", icon: <SiMysql />, category: "Databases", color: "#4479A1" },
  { name: "PostgreSQL", icon: <SiPostgresql />, category: "Databases", color: "#4169E1" },
  { name: "MongoDB", icon: <SiMongodb />, category: "Databases", color: "#47A248" },
  { name: "Git", icon: <SiGit />, category: "Tools", color: "#F05032" },
  { name: "GitHub", icon: <SiGithub />, category: "Tools", color: "#e6e6e6" },
  { name: "Linux", icon: <SiLinux />, category: "Tools", color: "#FCC624" },
  { name: "VS Code", icon: <VscVscode />, category: "Tools", color: "#007ACC" },
  { name: "Google Colab", icon: <SiGooglecolab />, category: "Tools", color: "#F9AB00" },
  { name: "Docker", icon: <SiDocker />, category: "Tools", color: "#2496ED" },
];

const itemVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">Technologies and tools I work with.</p>
        </motion.div>

        <div className="skills-grid">
          {skills.map((skill, idx) => (
            <motion.div
              className="skill-item"
              key={skill.name}
              custom={idx}
              variants={itemVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6 }}
            >
              <span className="skill-icon" style={{ color: skill.color }}>
                {skill.icon}
              </span>
              <span className="skill-name">{skill.name}</span>
              <span className="skill-category-label">{skill.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
