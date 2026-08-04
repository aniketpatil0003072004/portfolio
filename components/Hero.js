"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const roles = ["AI Enthusiast", "Problem Solver", "Web Developer", "Tech Enthusiast", "Cloud Computing Enthusiast"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = ["/profile.jpg", "/profile2.jpg"];
  const currentRole = roles[roleIndex];

  // Auto-flip photo every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const tick = useCallback(() => {
    if (!deleting) {
      if (charIndex < currentRole.length) {
        setCharIndex((c) => c + 1);
      } else {
        setTimeout(() => setDeleting(true), 1800);
        return;
      }
    } else {
      if (charIndex > 0) {
        setCharIndex((c) => c - 1);
      } else {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }
    }
  }, [charIndex, deleting, currentRole]);

  useEffect(() => {
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, deleting]);

  const handlePhotoClick = () => {
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="hero-greeting">Hello, I&apos;m</p>
          <h1 className="hero-name">
            Aniket <span>Patil</span>
          </h1>
          <div className="hero-typewriter">
            {currentRole.slice(0, charIndex)}
            <span className="typewriter-cursor" />
          </div>
          <p className="hero-desc">
            Passionate Computer Science student building innovative solutions
            in AI, Web Development, and Database systems.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact" className="btn-outline">Contact Me</a>
          </div>
        </motion.div>

        <motion.div
          className="hero-image-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="hero-image-glow" />
          <div
            className="hero-image-ring"
            onClick={handlePhotoClick}
            style={{ cursor: "pointer" }}
            title="Click to switch photo"
          >
            <motion.div
              key={photoIndex}
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            >
              <Image
                src={photos[photoIndex]}
                alt="Aniket Patil"
                width={310}
                height={310}
                className="hero-image"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
