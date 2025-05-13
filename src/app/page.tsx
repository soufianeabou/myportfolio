"use client";

import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { motion, useAnimation, AnimatePresence, useMotionValue } from "framer-motion";
import { Linkedin, Download, Mail, ArrowDown } from "lucide-react";
import { useSpring } from 'framer-motion';
import { useInView } from 'framer-motion';

// Add this helper for parallax tilt:
function useParallax(ref: React.RefObject<HTMLDivElement>) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * -8;
      setStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)` });
    };
    const handleMouseLeave = () => setStyle({ transform: "rotateX(0deg) rotateY(0deg) scale(1)" });
    const node = ref.current;
    if (node) {
      node.addEventListener("mousemove", handleMouseMove);
      node.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (node) {
        node.removeEventListener("mousemove", handleMouseMove);
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [ref]);
  return style;
}

// Add this helper for carousel drag constraints:
function useDragConstraints(imagesLength: number, imageWidth: number) {
  // Allow dragging only as far as the last image
  return { left: -imageWidth * (imagesLength - 1), right: 0 };
}

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [showPortfolio, setShowPortfolio] = useState(false);
  const controls = useAnimation();
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [modalProject, setModalProject] = useState<null | typeof projects[0]>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      controls.start({ opacity: 0, scale: 0, transition: { duration: 1.5 } });
      setTimeout(() => setShowPortfolio(true), 1500);
    }, 3000);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Determine scroll direction
      if (window.scrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (window.scrollY < lastScrollY) {
        setScrollDirection("up");
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Skills data with logos
  const skills = [
    { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Angular", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
    { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "MS SQL Server", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
    { name: "PowerBI", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
    { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "Tailwind", logo: "/tailwind.svg" }, // Local file
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  ];

  // Text-only skills
  const textSkills = ["Agile Methodologies", "Teamwork", "Communication"];

  // Projects data (fix image names and add AUIMarket)
  const projects = [
    {
      id: 1,
      title: 'AUI Chatbot',
      type: 'phone',
      stack: 'LLM, Python, ReactJS',
      images: ['/go1.jpg', '/go2.jpg', '/go3.PNG'],
      github: '#',
      description: 'A university chatbot powered by LLMs, built with Python and ReactJS, providing instant answers and campus information to students and staff.'
    },
    {
      id: 2,
      title: 'AUI Attendance System',
      type: 'laptop',
      stack: 'ReactJS, Tailwind',
      images: ['/att1.jpeg', '/att2.jpeg', '/att3.jpeg'],
      github: '#',
      description: 'A digital attendance system for AUI, streamlining check-ins and reporting for students and faculty, built with ReactJS and Tailwind.'
    },
    {
      id: 3,
      title: 'AUI Reporting Dashboard',
      type: 'laptop',
      stack: 'ReactJS, Tailwind, Axios, Spring Boot',
      images: ['/auirep1.jpeg', '/auirep2.jpeg', '/auirep3.jpeg'],
      github: '#',
      description: 'A reporting dashboard for AUI, featuring dynamic charts, exportable reports, and secure access, built with ReactJS and Spring Boot.'
    },
    {
      id: 4,
      title: 'Hotel Reservation System',
      type: 'laptop',
      stack: 'ReactJS, Tailwind, Axios',
      images: ['/hotel1.jpeg', '/hotel2.jpeg', '/hotel3.jpeg'],
      github: '#',
      description: 'A full-stack hotel reservation platform with real-time booking, admin dashboard, and guest management, built using ReactJS and Tailwind.'
    },
    {
      id: 5,
      title: 'AUIMarket',
      type: 'phone',
      stack: 'VueJS, MongoDB, ExpressJS, NodeJS',
      images: ['/auimarket1.png', '/auimarket2.png', '/auimarket3.png'],
      github: '#',
      description: 'E-Commerce Platform for AUI Students.'
    },
  ];

  // Add this before the main return:
  const floatingOrbs = Array.from({ length: 6 }).map((_, i) => ({
    size: 120 + Math.random() * 100,
    top: `${10 + Math.random() * 70}%`,
    left: `${10 + Math.random() * 80}%`,
    color: [
      'from-green-400/20 to-blue-500/10',
      'from-purple-500/20 to-green-400/10',
      'from-blue-400/20 to-purple-500/10',
    ][i % 3],
    delay: i * 0.7,
  }));

  // For Section 4: Project Universe
  const universeRef = useRef<HTMLDivElement>(null);
  const planetColors = [
    'from-green-400 via-blue-400 to-purple-500',
    'from-purple-500 via-pink-400 to-blue-400',
    'from-blue-400 via-green-400 to-yellow-400',
    'from-yellow-400 via-pink-400 to-green-400',
    'from-pink-400 via-purple-400 to-blue-400',
  ];
  // Orbit radii for each project
  const orbitRadii = [180, 240, 300, 360, 420];
  // Orbit durations (speed)
  const orbitDurations = [18, 22, 26, 30, 34];

  // For Section 4: Messy scattered layout
  const [cardTransforms, setCardTransforms] = useState<{ x: number; y: number; r: number }[]>([]);
  useLayoutEffect(() => {
    // Generate random positions/rotations for each card
    const transforms = projects.map(() => ({
      x: Math.random() * 320 - 160, // -160 to +160 px
      y: Math.random() * 120 - 60,  // -60 to +60 px
      r: Math.random() * 24 - 12,   // -12 to +12 deg
    }));
    setCardTransforms(transforms);
    // eslint-disable-next-line
  }, [projects.length]);

  // For Section 4 3D tilt effect
  const cardRefs = useMemo(() => projects.map(() => React.createRef<HTMLDivElement>()), [projects.length]);
  const [tilts, setTilts] = useState(() => projects.map(() => ({ x: 0, y: 0 })));
  const handleMouseMove = (index: number) => (e: React.MouseEvent) => {
    const ref = cardRefs[index].current;
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    setTilts(prev => prev.map((t, i) => i === index ? { x: rotateX, y: rotateY } : t));
  };
  const handleMouseLeave = (index: number) => () => {
    setTilts(prev => prev.map((t, i) => i === index ? { x: 0, y: 0 } : t));
  };

  // Before the return in your component:
  const tiltStyles = cardRefs.map(ref => useParallax(ref));

  return (
    <motion.div
      className={`relative transition-all duration-700 ${
        darkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      } min-h-screen flex flex-col items-center justify-center overflow-hidden font-['Anton',sans-serif]`}
    >
      {/* Light Mode Toggle & LinkedIn - Global Position */}
      <motion.div className="fixed top-6 right-6 flex space-x-4 p-4 items-center z-50">
        <a 
          href="https://www.linkedin.com/in/soufiane-aboulhamam-955b471a3/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Linkedin className="w-8 h-8 text-gray-400 hover:text-blue-500 transition-colors" />
        </a>
        <div
          className={`relative w-16 h-8 rounded-full flex items-center cursor-pointer p-1 transition-all ${
            darkMode ? "bg-green-500" : "bg-gray-400"
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <motion.div
            className="w-6 h-6 bg-white rounded-full shadow-md"
            animate={{ x: darkMode ? 32 : 0 }}
            transition={{ duration: 0.3 }}
          />
      </div>
      </motion.div>

      {/* Loading Screen - Particle Explosion Transition */}
      {loading ? (
        <motion.div
          className="absolute inset-0 flex justify-center items-center h-screen w-screen text-white text-6xl font-bold bg-black"
          initial={{ opacity: 1 }}
          animate={controls}
        >
          <motion.div
            className="absolute text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            SOUFIANE ABOULHAMAM
          </motion.div>
          {/* Particle Explosion */}
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
                key={i}
              className="w-2 h-2 bg-white rounded-full absolute"
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0,
                x: Math.random() * 1000 - 500,
                y: Math.random() * 1000 - 500,
              }}
              transition={{ delay: i * 0.02, duration: 1.5 }}
            />
          ))}
        </motion.div>
      ) : (
        <>
          {/* Futuristic Animated Background Elements */}
          {floatingOrbs.map((orb, i) => (
            <motion.div
              key={i}
              className={`fixed z-0 rounded-full blur-3xl pointer-events-none bg-gradient-radial ${orb.color}`}
                style={{
                width: orb.size,
                height: orb.size,
                top: orb.top,
                left: orb.left,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: orb.delay,
                ease: 'easeInOut',
                }}
            />
            ))}
            
          {/* Animated Data Streams */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="fixed z-0 w-1 h-2/3 bg-gradient-to-b from-green-400/30 via-blue-400/20 to-purple-500/10 rounded-full pointer-events-none"
              style={{ left: `${20 + i * 30}%`, top: 0 }}
              animate={{ y: [0, 40, 0] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
          ))}

          {/* Floating Particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
                  key={i}
              className="w-2 h-2 bg-green-500 rounded-full absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                  style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
            
          {/* First Section */}
          <motion.div
            className="h-screen w-full flex flex-col justify-center items-start px-24 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {/* Title & Buttons */}
            <motion.div className="text-left z-10">
              <h1 className="text-[60px] font-extrabold uppercase leading-tight tracking-wide">
                <span className="text-green-500">Web Developer</span> <br /> AI Enthusiast | ERP Developer
          </h1>
              <p className="text-md mt-4 font-light text-gray-400 max-w-xl">
                Passionate about creating scalable, high-performance solutions.
            </p>
              <div className="mt-8 flex space-x-4">
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center">
                  <Download className="mr-2" /> Download CV
            </button>
                <button className="px-6 py-3 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors flex items-center">
                  <Mail className="mr-2" /> Contact Me
            </button>
          </div>
            </motion.div>
        
            {/* Project Stats */}
            <motion.div className="absolute bottom-10 right-24 text-right">
              <h2 className={`text-4xl font-bold ${darkMode ? "text-green-500" : "text-black"}`}>3+</h2>
              <p className="text-lg">Projects</p>
              <h2 className={`text-4xl font-bold mt-4 ${darkMode ? "text-green-500" : "text-black"}`}>10+</h2>
              <p className="text-lg">Stacks</p>
            </motion.div>
          </motion.div>

          {/* Second Section - Introduction and Horizontal Timeline */}
          <motion.div
            className="h-screen w-full flex flex-col justify-center items-center px-8 relative"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Introduction */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-5xl font-extrabold mb-6 tracking-tight text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg"
            >
              Hi, I'm Soufiane
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-xl text-gray-300 mb-16 text-center max-w-2xl mx-auto font-medium"
            >
              I am Soufiane Aboulhamam, 22 years old, graduate from Al Akhawayn University with a Bachelor's in Computer Science. Now an ERP Developer at the same university. (They liked me so much they kept me!)
            </motion.p>

            {/* Animated Divider */}
            <motion.div
              className="w-40 h-2 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 blur-md shadow-lg mb-16"
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          
            {/* Timeline */}
            <div className="w-full max-w-6xl relative flex flex-col items-center">
              {/* Timeline Line */}
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-60 animate-pulse" />
              <div className="flex justify-between w-full pt-16">
              {[
                {
                    title: "ERP Administrator for Administrative Solutions",
                  time: "09/2024 - Present",
                    place: "ITS Department - AI Akhawayn University",
                },
                {
                  title: "Resident Assistant",
                  time: "10/2022 - 06/2024",
                    place: "Housing & Residential Life - AI Akhawayn University",
                },
                {
                  title: "Software Developer Intern",
                  time: "06/2023 - 08/2023",
                    place: "Marsa Maroc - Port of Casablanca",
                },
                {
                  title: "IT Intern",
                  time: "08/2021 - 09/2021",
                    place: "Inteleia IT Solutions - Casablanca",
                  },
              ].map((entry, index) => (
                  <motion.div
                    key={index}
                    className="relative w-56 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 rounded-full shadow-lg border-4 border-white/10 group-hover:scale-125 transition-transform duration-300" />
                    {/* Timeline Card */}
                    <div className="mt-12 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-xl hover:border-green-400/60 hover:shadow-[0_0_32px_rgba(72,187,120,0.4)] transition-all duration-300 cursor-pointer group-hover:scale-105 group-hover:ring-2 group-hover:ring-green-400/30">
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-green-400 transition-colors">{entry.title}</h3>
                      <p className="text-sm text-blue-300 mb-1">{entry.time}</p>
                      <p className="text-sm text-gray-400">{entry.place}</p>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
          </motion.div>

      {/* Third Section - Skills */}
      <motion.div
        className="h-screen w-full flex flex-col justify-center items-center px-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: scrollProgress >= 50 ? 1 : 0,
          y: scrollProgress >= 50 ? 0 : 100,
        }}
        transition={{ duration: 0.35 }}
      >
        {/* Cosmic/Nebula Overlay */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated Nebula Gradient */}
          <motion.div
            className="absolute left-1/4 top-1/4 w-2/3 h-2/3 rounded-full blur-3xl bg-gradient-to-br from-green-400/20 via-blue-500/20 to-purple-500/30 animate-pulse-slow"
            style={{ filter: 'blur(80px)' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          {/* Extra Particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${8 + Math.random() * 16}px`,
                height: `${8 + Math.random() * 16}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(2px)',
              }}
              animate={{ opacity: [0.5, 1, 0.5], y: [0, -10 + Math.random() * 20, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, repeatType: 'reverse', delay: i * 0.2 }}
            />
          ))}
        </motion.div>
        {/* Skills Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl font-bold text-center mb-12 z-10"
        >
          Skills
        </motion.h1>
        {/* Grid Layout for Skills */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 w-full max-w-6xl px-4 z-10">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer group relative"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{
                opacity: scrollProgress >= 50 + index * 5 ? 1 : 0,
                y: scrollProgress >= 50 + index * 5 ? 0 : 20,
                scale: scrollProgress >= 50 + index * 5 ? 1 : 0.8,
              }}
              transition={{
                delay: index * 0.07,
                duration: 0.22,
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
              }}
            >
              {/* Multi-layered Glassmorphism Background */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10 rounded-xl" />
              <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-green-500/30 transition-colors duration-300" />
              
              {/* Animated Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at center, rgba(72,187,120,0.15) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              {/* Floating Icon Container */}
              <motion.div
                className="relative mb-4"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}
              >
                {/* Icon Glow */}
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-colors duration-300" />
                
                {/* Skill Logo */}
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="w-12 h-12 relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </motion.div>
              
              {/* Skill Name with Gradient Text */}
              <p className="text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-colors duration-300">
                {skill.name}
              </p>
              
              {/* Hover Overlay with Skill Details */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
              >
                <div className="text-center p-4">
                  <p className="text-sm text-green-400 font-medium">Click to learn more</p>
                  <div className="w-8 h-0.5 bg-green-500/50 mx-auto mt-2 rounded-full" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        {/* Text-Only Skills */}
        <motion.div
          className="mt-12 text-center max-w-2xl z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-xl text-gray-400">
            I also excel in <span className="italic text-green-500">{textSkills.join(", ")}</span>, which are essential for delivering high-quality projects.
          </p>
        </motion.div>
      </motion.div>

          {/* Modern Scroll Indicator */}
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: scrollProgress < 95 ? 1 : 0, y: scrollProgress < 95 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-8 h-8 flex items-center justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-6 h-6 text-green-500" />
            </motion.div>
            <p className="text-sm text-gray-400 mt-2">Scroll Down</p>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div
            className="fixed bottom-0 left-0 h-1 bg-green-500"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* Section 4: My Projects */}
          <motion.section
            className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 bg-black overflow-hidden"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Animated Cosmic Parallax Background */}
            <motion.div className="absolute inset-0 z-0 pointer-events-none">
              {/* Animated gradients */}
              <motion.div
                className="absolute left-1/4 top-1/4 w-2/3 h-2/3 rounded-full blur-3xl bg-gradient-to-br from-green-400/30 via-blue-500/30 to-purple-500/40 animate-pulse-slow"
                style={{ filter: 'blur(120px)' }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
              {/* Parallax stars */}
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: `${8 + Math.random() * 12}px`,
                    height: `${8 + Math.random() * 12}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    filter: 'blur(4px)',
                  }}
                  animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -10 + Math.random() * 20, 0] }}
                  transition={{ duration: 8 + i, repeat: Infinity, repeatType: 'reverse', delay: i * 0.2 }}
                />
              ))}
              {/* Floating sparkles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 shadow-lg"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                    opacity: 0.7,
                  }}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2 + i * 0.2, repeat: Infinity, repeatType: 'reverse', delay: i * 0.3 }}
                />
              ))}
            </motion.div>
            {/* Animated Neon Gradient Title with Sparkles */}
            <motion.h2
              className="relative text-5xl md:text-6xl font-extrabold mb-16 tracking-tight text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg z-10 select-none"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              animate={{
                textShadow: [
                  '0 0 16px #22d3ee, 0 0 32px #a21caf',
                  '0 0 32px #22d3ee, 0 0 64px #a21caf',
                ],
                scale: [1, 1.03],
              }}
              transition={{
                opacity: { duration: 0.7, type: 'spring' },
                y: { duration: 0.7, type: 'spring' },
                scale: { duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                textShadow: { duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              }}
            >
              My Projects
              {/* Sparkle overlay */}
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 pointer-events-none">
                <motion.svg
                  width="32" height="32" viewBox="0 0 32 32" fill="none"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="16" cy="16" r="8" fill="url(#sparkleGradient)" opacity="0.7" />
                  <defs>
                    <radialGradient id="sparkleGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </radialGradient>
                  </defs>
                </motion.svg>
              </span>
            </motion.h2>
            {/* Responsive, Elevated Card Layout */}
            <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 z-10">
              {projects.map((project, idx) => {
                const isExpanded = expandedProject === project.id;
                return (
                  <AnimatePresence key={project.id}>
                    {!isExpanded && (
                      <motion.div
                        className="relative flex flex-col items-center justify-between bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 transition-all duration-300 cursor-pointer group hover:border-green-400/40 hover:shadow-[0_0_48px_8px_rgba(72,187,120,0.18)]"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                        whileHover={{
                          y: -18,
                          scale: 1.04,
                          boxShadow: '0 0 96px 24px rgba(72,187,120,0.22)',
                          borderColor: '#22d3ee',
                        }}
                        onClick={() => {
                          setExpandedProject(project.id);
                          setTimeout(() => {
                            document.getElementById(`project-expanded-${project.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 200);
                        }}
                      >
                        {/* Device Frame & Image (with blur for mystery) */}
                        <div className={`relative w-full flex items-center justify-center mb-6 ${project.type === 'phone' ? 'h-[320px]' : 'h-[200px]'}`}>
                          <div className={`absolute inset-0 z-0 ${project.type === 'phone' ? 'rounded-[2.2rem] border-2 border-white/10' : 'rounded-2xl border-2 border-white/10'}`}
                            style={{ boxShadow: '0 8px 48px 0 rgba(72,187,120,0.10)' }}
                          />
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className={`object-contain w-full h-full ${project.type === 'phone' ? 'rounded-[2.2rem]' : 'rounded-2xl'} filter grayscale blur-sm group-hover:blur-0 group-hover:grayscale-0 transition-all duration-500`}
                            loading="lazy"
                          />
                          {/* Device details (speaker/camera) */}
                          {project.type === 'phone' ? (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
                          ) : (
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full border border-white/20" />
                          )}
                        </div>
                        {/* Project Info */}
                        <div className="flex flex-col items-center flex-1 justify-center z-20 px-2">
                          <h3 className="text-xl font-bold text-white mb-1 text-center group-hover:text-green-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-blue-300 mb-1">{project.stack}</p>
                          <p className="text-xs text-gray-400 text-center mb-2 line-clamp-2">{project.description}</p>
                        </div>
                        {/* Floating GitHub Link */}
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg font-semibold text-xs z-20 hover:scale-110 hover:rotate-2 transition-transform duration-300"
                          whileHover={{ scale: 1.13, rotate: 4 }}
                          whileTap={{ scale: 0.97, rotate: -4 }}
                        >
                          View on GitHub
                        </motion.a>
                      </motion.div>
                    )}
                    {isExpanded && (
                      <motion.div
                        id={`project-expanded-${project.id}`}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Animated image reveal - bigger images */}
                        <div className="flex flex-row gap-8 items-center justify-center w-full max-w-6xl mb-8">
                          {project.images.map((img, i) => (
                            <motion.div
                              key={img}
                              className="relative flex-1 flex items-center justify-center"
                              initial={{ opacity: 0, y: 40, scale: 0.8, rotateY: -30 }}
                              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                              transition={{ duration: 0.4, delay: 0.12 + i * 0.12, type: 'spring' }}
                            >
                              <img
                                src={img}
                                alt={project.title + ' image'}
                                className="rounded-2xl shadow-2xl max-h-[80vh] max-w-[32vw] object-contain bg-black/30 backdrop-blur-xl border border-white/10"
                                style={{ filter: 'blur(8px)', transition: 'filter 0.5s' }}
                                onLoad={e => (e.currentTarget.style.filter = 'blur(0px)')}
                              />
                            </motion.div>
                          ))}
                        </div>
                        {/* Description and GitHub button */}
                        <motion.div
                          className="flex flex-col items-center justify-center"
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                        >
                          <h3 className="text-3xl font-bold text-white mb-4 text-center drop-shadow-lg">
                            {project.title}
                          </h3>
                          <p className="text-lg text-blue-300 mb-4 text-center max-w-2xl">
                            {project.description}
                          </p>
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg font-bold text-lg z-20 hover:scale-110 hover:rotate-2 transition-transform duration-300 border-2 border-white/10"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                            whileHover={{ scale: 1.13, rotate: 4, boxShadow: '0 0 32px 8px #22d3ee' }}
                            whileTap={{ scale: 0.97, rotate: -4 }}
                          >
                            <span className="inline-block mr-2">View on GitHub</span>
                            <svg className="inline-block w-6 h-6 align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8l6 6m0 0l-6 6m6-6H2" /></svg>
                          </motion.a>
                          <button
                            className="mt-8 px-6 py-2 text-white bg-black/40 rounded-xl border border-white/20 hover:bg-black/70 transition-colors"
                            onClick={() => setExpandedProject(null)}
                          >
                            Close
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </motion.section>
        </>
      )}
    </motion.div>
  );
}