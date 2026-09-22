"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";

const roles = ["AI enthusiast", "web developer", "problem solver", "backend builder"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const currentRole = roles[roleIndex];

  const tick = useCallback(() => {
    if (!deleting && charIndex < currentRole.length) {
      setCharIndex((value) => value + 1);
      return;
    }
    if (!deleting) {
      setDeleting(true);
      return;
    }
    if (charIndex > 0) {
      setCharIndex((value) => value - 1);
      return;
    }
    setDeleting(false);
    setRoleIndex((value) => (value + 1) % roles.length);
  }, [charIndex, currentRole, deleting]);

  useEffect(() => {
    const timer = setTimeout(tick, deleting ? 42 : charIndex === currentRole.length ? 1700 : 78);
    return () => clearTimeout(timer);
  }, [tick, deleting, charIndex, currentRole]);

  return (
    <section className="hero" id="home">
      <div className="container hero-content">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }}>
          Computer science & engineering · 2026
        </motion.p>
        <motion.h1 className="hero-name" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          {/* {profile.name.split(" ")[0]} <span>{profile.name.split(" ").slice(1).join(" ")}</span> */}
          {profile.name}
        </motion.h1>
        <div className="hero-typewriter">{currentRole.slice(0, charIndex)}<span className="typewriter-cursor" /></div>
        <p className="hero-desc">{profile.intro}</p>
        <div className="hero-buttons">
          <a href="#projects" className="btn-primary">View projects</a>
          <a href="#contact" className="btn-outline">Get in touch</a>
        </div>
      </div>
    </section>
  );
}
