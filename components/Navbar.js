"use client";
import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#home" className="navbar-logo" aria-label="Aniket Patil home">AP / 01</a>
        <ul className={`navbar-links ${open ? "open" : ""}`}>
          {links.map((link) => (
            <li key={link.href}><a href={link.href} onClick={() => setOpen(false)}>{link.label}</a></li>
          ))}
        </ul>
        <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </nav>
  );
}
