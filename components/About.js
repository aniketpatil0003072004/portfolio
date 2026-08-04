"use client";
import { motion } from "framer-motion";

const education = [
  {
    degree: "B.E. in Computer Science & Engineering",
    school: "Bapuji Institute of Engineering and Technology, Davanagere",
    meta: "2022 – 2026  •  CGPA: 8.30 ",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">A glimpse into who I am and my education .</p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p>
              I am a passionate Computer Science and Engineering student with a strong
              interest in AI, Web Development, and Database systems. I love turning
              complex ideas into simple, impactful solutions.
            </p>
            <p>
              As a strong problem-solver, I thrive in collaborative environments and
              am always eager to learn new technologies. I focus on building innovative
              and user-centric applications that solve real-world problems.
            </p>
          </motion.div>

          <div className="education-timeline">
            {education.map((edu, i) => (
              <motion.div
                className="edu-item"
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <h4>{edu.degree}</h4>
                <p className="edu-school">{edu.school}</p>
                <p className="edu-meta">{edu.meta}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
