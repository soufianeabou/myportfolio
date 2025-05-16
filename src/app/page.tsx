"use client";

import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { useAnimation, useMotionValue, useSpring, useInView } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Download, Mail, ArrowDown, Github, ExternalLink, Info, X } from "lucide-react";

// Types
interface Skill {
  name: string;
  logo: string;
}

interface Project {
  id: number;
  title: string;
  type: 'phone' | 'laptop';
  stack: string;
  images: string[];
  github: string;
  description: string;
  features?: string[];
  demoUrl?: string;
}

interface TimelineEntry {
  title: string;
  company: string;
  department: string;
  time: string;
  description: string;
  skills: string[];
}

interface MousePosition {
  x: number;
  y: number;
}

interface FloatingOrb {
  size: number;
  top: string;
  left: string;
  color: string;
  delay: number;
}

interface CardTransform {
  x: number;
  y: number;
  r: number;
}

interface Tilt {
  x: number;
  y: number;
}

// Components for Mouse Interaction and Parallax Effects
const MouseFollowLight = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const lightRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.style.left = `${mousePosition.x}px`;
      lightRef.current.style.top = `${mousePosition.y}px`;
    }
  }, [mousePosition]);
  
  return (
    <div 
      ref={lightRef}
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none mix-blend-lighten opacity-[0.03] blur-3xl -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-blue-500 to-transparent z-0"
      style={{ 
        transition: 'left 0.7s cubic-bezier(0.22, 1, 0.36, 1), top 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    />
  );
};

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
}

const TimelineItem = ({ entry, index }: TimelineItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      ref={itemRef}
      className={`relative mb-20 flex flex-col ${
        isEven ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-center gap-6`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline node with reveal effect */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <motion.div 
          className="w-3 h-3 rounded-full bg-blue-400 relative"
          animate={isHovered ? { scale: 1.5 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Pulsing effect */}
          <motion.div
            className="absolute -inset-1 rounded-full"
            style={{ 
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)"
            }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </motion.div>
        
        {/* Date label */}
        <div className="absolute top-5 whitespace-nowrap text-xs text-gray-400 font-light">
          <span className="bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
            {entry.time}
          </span>
        </div>
      </div>

      {/* Content card with hover effects */}
      <motion.div 
        className={`w-full md:w-5/12 ${
          isEven ? 'md:text-left md:pr-16' : 'md:text-right md:pl-16'
        }`}
        animate={isHovered ? { y: -5 } : { y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden group transition-all duration-300"
          animate={isHovered ? { 
            borderColor: "rgba(59, 130, 246, 0.3)",
            boxShadow: "0 10px 30px -12px rgba(59, 130, 246, 0.15)"
          } : {}}
          transition={{ duration: 0.3 }}
        >
          {/* Highlight overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
            
          <div className="relative z-10">
            <h4 className="text-lg font-medium text-white mb-1">{entry.title}</h4>
            <p className="text-blue-300 font-medium mb-1">{entry.company}</p>
            <p className="text-gray-400 text-sm mb-4">{entry.department}</p>
            <p className="text-gray-300 text-sm mb-4">{entry.description}</p>
            
            {/* Skills tags */}
            <div className={`flex gap-2 flex-wrap ${isEven ? '' : 'md:justify-end'}`}>
              {entry.skills.map((skill: string, i: number) => (
                <span 
                  key={i} 
                  className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

interface ParallaxBoxProps {
  children: React.ReactNode;
}

const ParallaxBox = ({ children }: ParallaxBoxProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;
    
    const box = boxRef.current.getBoundingClientRect();
    const mouseX = e.clientX - box.left;
    const mouseY = e.clientY - box.top;
    
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Subtle rotation effect - limited to 2 degrees
    const rotateX = ((mouseY - centerY) / centerY) * 2;
    const rotateY = ((mouseX - centerX) / centerX) * -2;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  const handleMouseLeave = () => {
    // Reset rotation on mouse leave
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={boxRef}
      className="relative transition-transform duration-200 ease-out"
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default function Portfolio() {
  // State management
  const [darkMode, setDarkMode] = useState(true); // Always dark mode
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [activeImageIndices, setActiveImageIndices] = useState<Record<number, number>>({});
  const [showCertification, setShowCertification] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  
  // Animation controls
  const controls = useAnimation();
  
  // Loading and animation effect
  useEffect(() => {
    setLoading(true);
    
    // Initial loading animation
    setTimeout(() => {
      setLoading(false);
      controls.start({ opacity: 0, scale: 0, transition: { duration: 1.5 } });
      
      // Show portfolio after intro animation
      setTimeout(() => setShowPortfolio(true), 1500);
    }, 3000);
  }, [controls]);

  // Scroll handling
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear any existing timeout
      clearTimeout(scrollTimeout);
      
      // Set a new timeout to handle the scroll event
      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        // If we've scrolled more than 100px, close the modal
        if (Math.abs(currentScrollY - lastScrollY) > 100) {
          setExpandedProject(null);
          setActiveSkill(null);
        }
        lastScrollY = currentScrollY;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Add this effect to handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setActiveSkill(null);
      // Reset expanded project when scrolling
      setExpandedProject(null);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Skills data with logos
  const skills: Skill[] = [
    { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Angular", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
    { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "MS SQL Server", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
    { name: "PowerBI", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
    { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "Tailwind", logo: "/tailwind.svg" },
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  ];

  // Text-only skills
  const textSkills = ["Agile Methodologies", "Teamwork", "Communication"];

  // Projects data
  const projects: Project[] = [
    {
      id: 1,
      title: 'AUI Chatbot (GoChat)',
      type: 'phone',
      stack: 'LLM, Python, ReactJS',
      images: ['/go1.jpg', '/go2.jpg', '/go3.PNG'],
      github: '#',
      demoUrl: 'https://aui.ma',
      description: 'A university chatbot powered by LLMs, built with Python and ReactJS, providing instant answers and campus information to students and staff.',
      features: [
        'Natural language processing using LLMs',
        'Real-time chat interface',
        'Integration with university database',
        'Mobile-responsive design'
      ]
    },
    {
      id: 2,
      title: 'AUI Attendance System',
      type: 'laptop',
      stack: 'ReactJS, Tailwind',
      images: ['/att1.jpeg', '/att2.jpeg', '/att3.jpeg'],
      github: 'https://github.com/soufianeabou/auirollcallattendance',
      description: 'A digital attendance system for AUI, streamlining check-ins and reporting for students and faculty, built with ReactJS and Tailwind.',
      features: [
        'QR code check-in system',
        'Attendance analytics dashboard',
        'Automated reporting',
        'Faculty management panel'
      ]
    },
    {
      id: 3,
      title: 'AUI Reporting Dashboard',
      type: 'laptop',
      stack: 'ReactJS, Tailwind, Axios, Spring Boot',
      images: ['/auirep1.jpeg', '/auirep2.jpeg', '/auirep3.jpeg'],
      github: 'https://github.com/soufianeabou/aui-reporting-dashboard',
      description: 'A reporting dashboard for AUI, featuring dynamic charts, exportable reports, and secure access, built with ReactJS and Spring Boot.',
      features: [
        'Interactive data visualization',
        'PDF and Excel export functionality',
        'Role-based access control',
        'Real-time data updates'
      ]
    },
    {
      id: 4,
      title: 'Hotel Reservation System',
      type: 'laptop',
      stack: 'ReactJS, Tailwind, Axios',
      images: ['/hotel1.jpeg', '/hotel2.jpeg', '/hotel3.jpeg'],
      github: '#',
      description: 'A full-stack hotel reservation platform with real-time booking, admin dashboard, and guest management, built using ReactJS and Tailwind.',
      features: [
        'Room availability calendar',
        'Secure payment processing',
        'Guest management system',
        'Analytics and reporting'
      ]
    },
    {
      id: 5,
      title: 'AUIMarket',
      type: 'laptop',
      stack: 'VueJS, MongoDB, ExpressJS, NodeJS',
      images: ['/auimarket1.png', '/auimarket2.png', '/auimarket3.png'],
      github: 'https://github.com/soufianeabou/auimarket',
      description: 'E-Commerce Platform for AUI Students, featuring a modern marketplace for campus-related goods and services.',
      features: [
        'User authentication and profiles',
        'Product listing and search',
        'Secure payment integration',
        'Order tracking system'
      ],
      demoUrl: '#'
    },
  ];

  // Background visual elements
  const floatingOrbs: FloatingOrb[] = Array.from({ length: 6 }).map((_, i) => ({
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

  // For Project Universe section
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

  // For messy scattered layout
  const [cardTransforms, setCardTransforms] = useState<CardTransform[]>([]);
  useLayoutEffect(() => {
    // Generate random positions/rotations for each card
    const transforms = projects.map(() => ({
      x: Math.random() * 320 - 160, // -160 to +160 px
      y: Math.random() * 120 - 60,  // -60 to +60 px
      r: Math.random() * 24 - 12,   // -12 to +12 deg
    }));
    setCardTransforms(transforms);
    
    // Initialize active image indices
    const indices: Record<number, number> = {};
    projects.forEach(project => {
      indices[project.id] = 0;
    });
    setActiveImageIndices(indices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For 3D tilt effect
  const cardRefs = useMemo(() => projects.map(() => React.createRef<HTMLDivElement>()), []);
  const [tilts, setTilts] = useState<Tilt[]>(() => projects.map(() => ({ x: 0, y: 0 })));
  
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

  // Calculate parallax tilt styles
  const tiltStyles = cardRefs.map(ref => ({
    transform: "rotateX(0deg) rotateY(0deg) scale(1)"
  }));

  // Navigation helpers for project images
  const nextImage = (projectId: number) => {
    setActiveImageIndices(prev => {
      const currentIndex = prev[projectId] || 0;
      const project = projects.find(p => p.id === projectId);
      if (!project) return prev;
      
      return {
        ...prev,
        [projectId]: currentIndex === project.images.length - 1 ? 0 : currentIndex + 1
      };
    });
  };
  
  const prevImage = (projectId: number) => {
    setActiveImageIndices(prev => {
      const currentIndex = prev[projectId] || 0;
      const project = projects.find(p => p.id === projectId);
      if (!project) return prev;
      
      return {
        ...prev,
        [projectId]: currentIndex === 0 ? project.images.length - 1 : currentIndex - 1
      };
    });
  };

  return (
    <div
      className={`relative transition-all duration-700 ${
        darkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      } min-h-screen flex flex-col items-center justify-center overflow-hidden font-['Poppins',sans-serif]`}
    >
      {/* Light Mode Toggle & LinkedIn - Global Position */}
      <motion.div 
        className="fixed top-6 right-6 flex items-center z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <a 
          href="https://www.linkedin.com/in/soufiane-aboulhamam-955b471a3/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group"
        >
          <Linkedin className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
        </a>
      </motion.div>

      {/* Loading Screen - Particle Explosion Transition */}
      {loading ? (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center relative">
            {/* Enhanced Animated Circles */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 rounded-full border border-green-500 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.2, opacity: 0.6 }}
                animate={{ 
                  scale: [0.2, 1, 1.8],
                  opacity: [0.6, 0.2, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                }}
              />
            ))}
            
            {/* Enhanced Particle System */}
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              const radius = Math.random() * 200 + 100;
              const delay = 0.5 + Math.random() * 1.5;
              
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"
                  initial={{ 
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{ 
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{
                    duration: 2,
                    delay: delay,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              );
            })}
            
            {/* Enhanced Name Text with Gradient Glow */}
            <motion.div
              className="text-5xl sm:text-6xl md:text-7xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                SOUFIANE ABOULHAMAM
              </span>
            </motion.div>
          </div>
        </div>
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
            
          {/* First Section - Hero */}
          <motion.div
            className="h-screen w-full flex flex-col justify-center items-start px-8 md:px-24 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Animated gradient orbs */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${
                      i === 0 ? 'rgba(74, 222, 128, 0.15)' :
                      i === 1 ? 'rgba(59, 130, 246, 0.15)' :
                      'rgba(147, 51, 234, 0.15)'
                    } 0%, transparent 70%)`,
                    width: `${300 + i * 200}px`,
                    height: `${300 + i * 200}px`,
                    left: `${20 + i * 30}%`,
                    top: `${20 + i * 20}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
              ))}
              
              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute w-full h-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              </div>
            </div>

            {/* Content with Enhanced Animations */}
            <motion.div 
              className="relative z-10 max-w-4xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {/* Title with Staggered Animation */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl md:text-[60px] font-extrabold uppercase leading-tight tracking-wide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="text-green-500">Web Developer</span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    AI Enthusiast | ERP Developer
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-md mt-4 font-light text-gray-400 max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Passionate about creating scalable, high-performance solutions that solve real-world problems.
                  <span className="hidden md:inline"> Focused on delivering exceptional user experiences through modern web technologies.</span>
                </motion.p>
              </div>

              {/* Enhanced CTA Buttons */}
              <motion.div 
                className="flex flex-wrap gap-5 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center hover:shadow-neon transition-all duration-300 group"
                >
                  <Download className="mr-3 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Download CV</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-black/30 backdrop-blur-md border border-green-500 text-green-400 rounded-xl flex items-center hover:bg-green-500/10 transition-all duration-300 group"
                >
                  <Mail className="mr-3 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Contact Me</span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Enhanced Stats Display */}
            <motion.div 
              className="absolute bottom-10 right-8 md:right-24 text-right"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8, type: "spring" }}
            >
              <div className="relative">
                <motion.h2 
                  className="text-4xl font-bold text-green-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  3+
                </motion.h2>
                <p className="text-lg text-gray-300">Projects</p>
                <motion.div 
                  className="absolute -left-4 -top-4 w-16 h-16 border border-green-500/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
              
              <div className="relative mt-4">
                <motion.h2 
                  className="text-4xl font-bold text-blue-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                >
                  10+
                </motion.h2>
                <p className="text-lg text-gray-300">Stacks</p>
                <motion.div 
                  className="absolute -left-4 -top-4 w-16 h-16 border border-blue-500/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                />
              </div>
            </motion.div>

            {/* Enhanced Scroll Indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="w-8 h-12 border-2 border-green-500 rounded-full flex justify-center p-2">
                <motion.div 
                  className="w-1 bg-green-500 rounded-full"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <motion.p 
                className="text-xs text-gray-400 mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SCROLL DOWN
              </motion.p>
            </motion.div>
          </motion.div>

{/* Second Section - Introduction and Timeline with Advanced Animations */}
<motion.section
  className="min-h-screen w-full flex flex-col justify-center items-center px-8 py-20 relative"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.1 }}
  transition={{ duration: 0.8 }}
>
  {/* Parallax Background Elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute w-full h-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
    </div>
    
    {/* Parallax floating elements */}
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={`float-${i}`}
        className="absolute rounded-full mix-blend-lighten opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)",
          width: 100 + Math.random() * 300,
          height: 100 + Math.random() * 300,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        initial={{ scale: 0.8 }}
        animate={{
          y: [0, -15, 0],
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{
          duration: 7 + Math.random() * 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: i * 2
        }}
      />
    ))}
    
    {/* Moving gradient band */}
    <motion.div
      className="absolute -inset-1/2 opacity-[0.02] blur-3xl"
      style={{
        background: "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
        height: '150%',
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 60,
        ease: "linear",
        repeat: Infinity
      }}
    />
  </div>

  {/* Content Container with Scroll-Based Animations */}
  <motion.div 
    className="w-full max-w-5xl mx-auto z-10 relative"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
  >
    {/* Introduction with Scroll-Triggered Typography Animation */}
    <div className="mb-24 relative overflow-hidden">
      <div className="relative z-10">
        <motion.div
          className="overflow-hidden inline-block"
          initial={{ y: 0 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-center text-white"
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          >
            <motion.span 
              className="inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Hi, I'm{" "}
            </motion.span>
            <motion.span 
              className="inline-block text-blue-400 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              Soufiane
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-[2px] bg-blue-400"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.2 }}
              />
            </motion.span>
          </motion.h2>
        </motion.div>

        <div className="overflow-hidden">
          <motion.p
            className="text-lg md:text-xl text-gray-300 mt-6 mb-12 text-center max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            A 22-year-old Computer Science graduate from Al Akhawayn University, now working as an ERP Developer at the same institution. I specialize in creating elegant, functional digital experiences.
          </motion.p>
        </div>
      </div>
      
      {/* Animated accent graphic element */}
      <motion.div 
        className="w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto my-16 opacity-60"
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
      />
    </div>

    {/* Experience Timeline with Animated Sections */}
    <div className="relative mb-32">
      <motion.h3
        className="text-2xl font-medium text-center mb-16 text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Professional Experience
      </motion.h3>

      {/* Mouse-following subtle highlight effect */}
      <MouseFollowLight />

      {/* Vertical timeline with mouse interaction effects */}
      <div className="relative z-10">
        {/* Timeline central line with scrolling animation */}
        <motion.div 
          className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />

        {/* Timeline entries with staggered reveal and perspective effect */}
        {[
          {
            title: "ERP Administrator",
            company: "AI Akhawayn University",
            department: "ITS Department",
            time: "09/2024 - Present",
            description: "Managing administrative solutions and system integrations.",
            skills: ["ERP Administration", "Web Development", "Team leading"]
          },
          {
            title: "Resident Assistant",
            company: "AI Akhawayn University",
            department: "Housing & Residential Life",
            time: "10/2022 - 06/2024",
            description: "Supervised residential facilities and coordinated student activities.",
            skills: ["Leadership", "Conflict Resolution", "Event Planning"]
          },
          {
            title: "Software Developer Intern",
            company: "Marsa Maroc",
            department: "Port of Casablanca",
            time: "06/2023 - 08/2023",
            description: "Developed port management software solutions.",
            skills: ["Web Development", "SDLC", "API Integration"]
          },
          {
            title: "IT Intern",
            company: "Intelcia IT Solutions",
            department: "Casablanca",
            time: "08/2021 - 09/2021",
            description: "Assisted with IT infrastructure and software development projects.",
            skills: ["Technical Support", "Service Desk", "Documentation"]
          },
        ].map((entry, index) => (
          <TimelineItem 
            key={index}
            entry={entry}
            index={index}
          />
        ))}
      </div>
    </div>

    {/* Certification section with parallax effects */}
    <motion.div
      className="w-full max-w-4xl mx-auto mt-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <ParallaxBox>
        <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-10 overflow-hidden relative">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute w-96 h-96 rounded-full bg-blue-500/5 blur-3xl -bottom-48 -right-48"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
              className="absolute w-full h-full opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.15), transparent 60%)"
              }}
            />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Certification logo with parallax effect */}
            <div className="relative">
              <motion.div
                className="w-28 h-28 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-md border border-white/10 overflow-hidden relative shadow-lg"
                whileHover={{ 
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.2)",
                  scale: 1.03 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/5" />
                <img 
                  src="/blockchain.png" 
                  alt="Blockchain Council Logo" 
                  className="w-20 h-20 object-contain relative z-10"
                />
              </motion.div>
            </div>
            
            {/* Certification details */}
            <div className="flex-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-2 text-center md:text-left">Certified GenAI Expert</h3>
                <p className="text-gray-300 mb-6 text-center md:text-left">Blockchain Council</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Large Language Models", "Generative AI", "Prompt Engineering", "RAG Development"].map((skill, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-blue-500/5 text-blue-300 px-3 py-1 rounded-full border border-blue-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 flex-wrap md:flex-nowrap">
                  <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Valid through <span className="text-white">2026</span></span>
                  </div>
                  
                  <motion.button
                    className="px-5 py-2 rounded-lg text-blue-300 flex items-center gap-2 bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCertification(true)}
                  >
                    <span>View Certification</span>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </ParallaxBox>
    </motion.div>
  </motion.div>
</motion.section>

                      {/* Third Section - Skills */}
          <motion.div
            className="min-h-screen w-full flex flex-col justify-center items-center px-8 py-20 relative overflow-hidden"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl font-bold text-center mb-12 z-10 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              Skills & Expertise
            </motion.h1>
            
            {/* Grid Layout for Skills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 w-full max-w-6xl px-4 z-10">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer group relative"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.07,
                    duration: 0.22,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    zIndex: 20,
                  }}
                  onHoverStart={() => setActiveSkill(skill.name)}
                  onHoverEnd={() => setActiveSkill(null)}
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
                  
                  {/* Skill Name with Animated Reveal */}
                  <motion.div
                    className="relative h-6 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: activeSkill === skill.name ? 1 : 0,
                      height: activeSkill === skill.name ? "auto" : "0"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.p
                      className="text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-colors duration-300 text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: activeSkill === skill.name ? 0 : 20,
                        opacity: activeSkill === skill.name ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {skill.name}
                    </motion.p>
                  </motion.div>
                  
                  {/* Skill Level Indicator */}
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-1.5 h-1.5 rounded-full ${
                          level <= (index % 5) + 1
                            ? 'bg-green-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Text-Only Skills */}
            <motion.div
              className="mt-16 text-center max-w-2xl z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">Soft Skills</h3>
              <p className="text-xl text-gray-300">
                I also excel in <span className="font-medium text-green-500">{textSkills.join(", ")}</span>, which are essential for delivering high-quality projects.
              </p>
              
              {/* Skill Rating Bars */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {textSkills.map((skill, i) => (
                  <div key={skill} className="relative">
                    <p className="text-left text-gray-300 mb-2">{skill}</p>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: `${85 + i * 5}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
            className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* Section 4: Projects */}
          <motion.section
            className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 bg-black overflow-hidden"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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
              
              {/* Digital data streams effect */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div 
                  key={`stream-${i}`}
                  className="absolute h-72 w-px bg-gradient-to-b from-transparent via-green-400/40 to-transparent"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `-10%`,
                  }}
                  animate={{ 
                    y: [0, 500],
                    opacity: [0, 0.8, 0],
                    height: [100, 300, 100]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: i * 2
                  }}
                />
              ))}
            </motion.div>
            
            {/* Section Title */}
            <motion.h2
              className="relative text-5xl md:text-6xl font-extrabold mb-16 tracking-tight text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg z-10 select-none"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
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
            
            {/* Enhanced Project Layout */}
            <div className="relative w-full max-w-6xl mx-auto z-10">
              {projects.map((project, idx) => {
                const isExpanded = expandedProject === project.id;
                const activeImageIndex = activeImageIndices[project.id] || 0;
                
                return (
                  <AnimatePresence key={project.id}>
                    {!isExpanded && (
                      <motion.div
                        id={`project-${project.id}`}
                        className={`relative w-full mb-28 ${idx % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        exit={{ opacity: 0, y: -60 }}
                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                      >
                        <div className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                          {/* Enhanced Device Preview */}
                          <motion.div 
                            className="w-full md:w-3/5 relative"
                            whileHover="hover"
                          >
                            {/* Device Container with 3D effect */}
                            <motion.div
                              className="relative transition-all duration-500"
                              style={{ 
                                transformStyle: "preserve-3d",
                                perspective: "1000px"
                              }}
                              variants={{
                                hover: { 
                                  rotateY: idx % 2 === 0 ? -8 : 8,
                                  rotateX: 4,
                                  scale: 1.05,
                                  z: 10
                                }
                              }}
                            >
                              {/* Different styling for phone vs laptop */}
                              {project.type === 'phone' ? (
                                // Phone frame 
                                <div className="relative mx-auto" style={{ maxWidth: "280px" }}>
                                  {/* Phone body */}
                                  <div 
                                    className="relative z-10 bg-gray-900 rounded-[2.5rem] border-4 border-gray-800 shadow-xl overflow-hidden"
                                    style={{ 
                                      width: "280px", 
                                      height: "560px",
                                      boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(255, 255, 255, 0.1)"
                                    }}
                                  >
                                    {/* Phone screen with carousel */}
                                    <div className="relative h-full w-full bg-black overflow-hidden">
                                      {project.images.map((img, imgIndex) => (
                                        <div
                                          key={`${project.id}-${imgIndex}`}
                                          className={`absolute inset-0 transition-opacity duration-300 ${activeImageIndex === imgIndex ? 'opacity-100' : 'opacity-0'}`}
                                        >
                                          <motion.img
                                            className="project-image"
                                            src={img}
                                            alt={`${project.title} screenshot ${imgIndex + 1}`}
                                          />
                                        </div>
                                      ))}
                                      
                                      {/* Navigation dots */}
                                      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
                                        {project.images.map((_, i) => (
                                          <button
                                            key={`dot-${i}`}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === i ? 'bg-green-400 scale-125' : 'bg-white/50'}`}
                                            onClick={() => {
                                              setActiveImageIndices(prev => ({
                                                ...prev,
                                                [project.id]: i
                                              }));
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Phone notch */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-xl flex justify-center items-center z-20">
                                      <div className="w-12 h-1 bg-gray-800 rounded-full" />
                                      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rounded-full" />
                                    </div>
                                    
                                    {/* Phone buttons */}
                                    <div className="absolute -right-1 top-32 w-1 h-12 bg-gray-700 rounded-l-md" />
                                    <div className="absolute -right-1 top-48 w-1 h-12 bg-gray-700 rounded-l-md" />
                                    <div className="absolute -left-1 top-36 w-1 h-16 bg-gray-700 rounded-r-md" />
                                  </div>
                                  
                                  {/* Screen reflection */}
                                  <div 
                                    className="absolute top-0 left-0 right-0 h-full z-20 pointer-events-none opacity-30"
                                    style={{
                                      background: "linear-gradient(to bottom right, rgba(255,255,255,0.1), transparent 60%, rgba(255,255,255,0.05))",
                                      borderRadius: "2.5rem"
                                    }}
                                  />
                                  
                                  {/* Phone shadow */}
                                  <motion.div
                                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2/3 h-6 bg-black blur-xl rounded-full opacity-50 z-0"
                                    variants={{
                                      hover: { width: "75%", opacity: 0.7 }
                                    }}
                                  />
                                </div>
                              ) : (
                                // Laptop frame
                                <div className="relative mx-auto" style={{ maxWidth: "650px" }}>
                                  {/* Laptop base */}
                                  <div
                                    className="relative bg-gray-800 rounded-b-xl h-12 w-[650px] mx-auto z-10"
                                    style={{ 
                                      transformStyle: "preserve-3d",
                                      perspective: "1000px",
                                      boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.7)"
                                    }}
                                  >
                                    {/* Base notch */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-b-md" />
                                    
                                    {/* Trackpad */}
                                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-gray-700 rounded-lg" />
                                  </div>
                                  
                                  {/* Laptop screen */}
                                  <div
                                    className="relative mb-1 overflow-hidden bg-gray-900 rounded-t-xl border-8 border-gray-800 w-[650px] h-[380px] z-20"
                                    style={{ 
                                      transformStyle: "preserve-3d",
                                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
                                    }}
                                  >
                                    {/* Screen content with carousel */}
                                    <div className="relative h-full w-full bg-black overflow-hidden">
                                      {project.images.map((img, imgIndex) => (
                                        <div
                                          key={`${project.id}-${imgIndex}`}
                                          className={`absolute inset-0 transition-opacity duration-300 ${activeImageIndex === imgIndex ? 'opacity-100' : 'opacity-0'}`}
                                        >
                                          <motion.img
                                            className="project-image"
                                            src={img}
                                            alt={`${project.title} screenshot ${imgIndex + 1}`}
                                          />
                                        </div>
                                      ))}
                                      
                                      {/* Navigation dots */}
                                      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
                                        {project.images.map((_, i) => (
                                          <button
                                            key={`dot-${i}`}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === i ? 'bg-green-400 scale-125' : 'bg-white/50'}`}
                                            onClick={() => {
                                              setActiveImageIndices(prev => ({
                                                ...prev,
                                                [project.id]: i
                                              }));
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Webcam */}
                                    <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full" />
                                    
                                    {/* Screen reflection */}
                                    <div 
                                      className="absolute top-0 left-0 right-0 h-full z-30 pointer-events-none opacity-10"
                                      style={{
                                        background: "linear-gradient(to bottom right, rgba(255,255,255,0.2), transparent 70%, rgba(255,255,255,0.05))"
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Laptop shadow */}
                                  <motion.div
                                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black blur-xl rounded-full opacity-50 z-0"
                                    variants={{
                                      hover: { width: "85%", opacity: 0.7 }
                                    }}
                                  />
                                </div>
                              )}
                            </motion.div>
                            
                            {/* Image navigation controls */}
                            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 z-30">
                              <motion.button
                                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center border border-white/10"
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(74, 222, 128, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => prevImage(project.id)}
                              >
                                <ArrowDown className="h-5 w-5 transform rotate-90" />
                              </motion.button>
                              <motion.button
                                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center border border-white/10"
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(74, 222, 128, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => nextImage(project.id)}
                              >
                                <ArrowDown className="h-5 w-5 transform -rotate-90" />
                              </motion.button>
                            </div>
                          </motion.div>
                          
                          {/* Project Info Card */}
                          <motion.div 
                            className="w-full md:w-2/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden group"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.4 }}
                          >
                            {/* Background gradients */}
                            <div className="absolute -inset-full h-full w-full rounded-full blur-3xl opacity-30 bg-gradient-to-r from-green-400 to-blue-500 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow z-0" />
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl rounded-2xl z-10" />
                            
                            {/* Content */}
                            <div className="relative z-20 flex flex-col h-full">
                              {/* Title with animated underline */}
                              <h3 className="text-3xl font-bold mb-1 text-white group-hover:text-green-400 transition-colors">
                                {project.title}
                              </h3>
                              <motion.div
                                className="h-1 w-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4"
                                initial={{ width: 0 }}
                                whileInView={{ width: 64 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                              />
                              
                              {/* Tech stack with badge design */}
                              <div className="mb-4 flex flex-wrap gap-2">
                                {project.stack.split(', ').map((tech, i) => (
                                  <motion.span 
                                    key={i}
                                    className="inline-block px-3 py-1 bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-full text-xs font-medium text-green-400"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: 0.2 + (i * 0.1) }}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(74, 222, 128, 0.2)" }}
                                  >
                                    {tech}
                                  </motion.span>
                                ))}
                              </div>
                              
                              {/* Description with animated text reveal */}
                              <motion.p 
                                className="text-gray-300 mb-6 flex-grow"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                              >
                                {project.description}
                              </motion.p>
                              
                              {/* Features List (if available) */}
                              {project.features && project.features.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold text-blue-300 mb-2">Key Features</h4>
                                  <ul className="space-y-1">
                                    {project.features.slice(0, 2).map((feature, idx) => (
                                      <motion.li 
                                        key={idx} 
                                        className="text-sm text-gray-400 flex items-start"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 0.5 + (idx * 0.1) }}
                                      >
                                        <span className="text-green-500 mr-2">•</span> {feature}
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* GitHub Link Button */}
                              <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl font-medium text-white flex items-center justify-center gap-3 overflow-hidden relative group/link w-full"
                                whileHover="hover"
                              >
                                <span className="text-base">View on GitHub</span>
                                <motion.span
                                  variants={{
                                    hover: { x: [0, 4, 0] }
                                  }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                  <Github className="h-5 w-5" />
                                </motion.span>
                              </motion.a>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Expanded Project View (Modal) */}
                    {isExpanded && (
                      <motion.div
                        id={`project-expanded-${project.id}`}
                        className="fixed inset-0 z-[100] flex items-start justify-center bg-black/95 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Close button */}
                        <motion.button
                          className="fixed top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center z-[101] hover:bg-white/10 transition-all duration-300"
                          onClick={() => setExpandedProject(null)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="h-5 w-5 text-white" />
                        </motion.button>

                        {/* Main Content */}
                        <div className="w-full max-w-[1400px] mx-auto px-4 py-20">
                          {/* Project Header */}
                          <div className="flex flex-col md:flex-row gap-12 mb-20">
                            {/* Left Column - Project Info */}
                            <div className="md:w-1/2">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                <h3 className="text-4xl font-bold text-white mb-6">
                                  {project.title}
                                </h3>
                                <p className="text-lg text-gray-300 mb-8">
                                  {project.description}
                                </p>
                                
                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                  {project.stack.split(', ').map((tech, i) => (
                                    <span 
                                      key={i}
                                      className="px-3 py-1.5 bg-white/5 rounded-full text-sm text-gray-300"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                  <motion.a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-white text-black rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Github className="h-5 w-5" />
                                    GitHub
                                  </motion.a>
                                  
                                  {project.demoUrl && (
                                    <motion.a
                                      href={project.demoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-6 py-3 bg-white/5 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <ExternalLink className="h-5 w-5" />
                                      Live Demo
                                    </motion.a>
                                  )}
                                </div>
                              </motion.div>
                            </div>

                            {/* Right Column - Main Project Image */}
                            <div className="md:w-1/2">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative aspect-video rounded-2xl overflow-hidden bg-white/5"
                              >
                                <motion.img
                                  src={project.images[0]}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.7 }}
                                />
                              </motion.div>
                            </div>
                          </div>

                          {/* Features Section */}
                          {project.features && project.features.length > 0 && (
                            <div className="mb-20">
                              <h4 className="text-2xl font-semibold text-white mb-8">Key Features</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {project.features.map((feature, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    className="p-6 bg-white/5 rounded-xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (idx * 0.1) }}
                                  >
                                    <p className="text-gray-200">{feature}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Enhanced Project Gallery */}
                          <div className="relative">
                            <div className="flex items-center justify-between mb-12">
                              <div>
                                <h4 className="text-3xl font-bold text-white mb-2">Project Gallery</h4>
                                <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                              </div>
                            </div>
                            
                            {/* Gallery Navigation */}
                            <div className="flex justify-between items-center mb-8 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                              <div className="flex gap-3">
                                {project.images.map((_, idx) => (
                                  <motion.button
                                    key={idx}
                                    className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                                      activeImageIndices[project.id] === idx 
                                        ? 'bg-gradient-to-r from-green-400 to-blue-500 scale-125' 
                                        : 'bg-white/30'
                                    }`}
                                    onClick={() => {
                                      setActiveImageIndices(prev => ({
                                        ...prev,
                                        [project.id]: idx
                                      }));
                                      const element = document.getElementById(`gallery-image-${idx}`);
                                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }}
                                    whileHover={{ scale: 1.2 }}
                                  >
                                    {activeImageIndices[project.id] === idx && (
                                      <motion.div
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                                        animate={{
                                          scale: [1, 1.5, 1],
                                          opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                          repeatType: "reverse",
                                        }}
                                      />
                                    )}
                                  </motion.button>
                                ))}
                              </div>
                              
                              <div className="flex gap-3">
                                <motion.button
                                  className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-green-500/30 group"
                                  onClick={() => {
                                    const currentIndex = activeImageIndices[project.id] || 0;
                                    const prevIndex = currentIndex === 0 ? project.images.length - 1 : currentIndex - 1;
                                    setActiveImageIndices(prev => ({
                                      ...prev,
                                      [project.id]: prevIndex
                                    }));
                                    const element = document.getElementById(`gallery-image-${prevIndex}`);
                                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }}
                                  whileHover={{ scale: 1.05, x: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ArrowDown className="h-5 w-5 transform rotate-90 group-hover:text-green-400 transition-colors" />
                                </motion.button>
                                
                                <motion.button
                                  className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-green-500/30 group"
                                  onClick={() => {
                                    const currentIndex = activeImageIndices[project.id] || 0;
                                    const nextIndex = currentIndex === project.images.length - 1 ? 0 : currentIndex + 1;
                                    setActiveImageIndices(prev => ({
                                      ...prev,
                                      [project.id]: nextIndex
                                    }));
                                    const element = document.getElementById(`gallery-image-${nextIndex}`);
                                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }}
                                  whileHover={{ scale: 1.05, x: 2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ArrowDown className="h-5 w-5 transform -rotate-90 group-hover:text-green-400 transition-colors" />
                                </motion.button>
                              </div>
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {project.images.map((img, i) => (
                                <motion.div
                                  key={img}
                                  id={`gallery-image-${i}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                                  className="relative group"
                                >
                                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                                    <motion.img
                                      src={img}
                                      alt={`${project.title} screenshot ${i + 1}`}
                                      className="w-full h-full object-cover"
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.7 }}
                                    />
                                    
                                    {/* Enhanced Image Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300">
                                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
                                        <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                                          {project.stack.split(', ').map((tech, i) => (
                                            <span 
                                              key={i}
                                              className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                                            >
                                              {tech}
                                            </span>
                                          ))}
                                        </div>
                                        <motion.a
                                          href={project.github}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl font-medium text-white flex items-center justify-center gap-3 overflow-hidden relative group/link"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <Github className="h-5 w-5" />
                                          View on GitHub
                                        </motion.a>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Glow Effect */}
                                  <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    animate={{
                                      scale: [1, 1.02, 1],
                                      opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatType: "reverse",
                                    }}
                                  />
                                </motion.div>
                              ))}
                            </div>

                            {/* Project Details Section */}
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Technical Details */}
                              <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                <h5 className="text-xl font-semibold text-white mb-4">Technical Details</h5>
                                <div className="space-y-4">
                                  <div>
                                    <span className="text-gray-400 text-sm">Tech Stack</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {project.stack.split(', ').map((tech, i) => (
                                        <span 
                                          key={i}
                                          className="px-3 py-1.5 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 text-sm">Project Type</span>
                                    <p className="text-white mt-1">{project.type === 'phone' ? 'Mobile Application' : 'Web Application'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 text-sm">Development Period</span>
                                    <p className="text-white mt-1">3 months</p>
                                  </div>
                                </div>
                              </div>

                              {/* Key Features */}
                              <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                <h5 className="text-xl font-semibold text-white mb-4">Key Features</h5>
                                <div className="space-y-3">
                                  {project.features?.map((feature, idx) => (
                                    <motion.div 
                                      key={idx}
                                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all duration-300"
                                      whileHover={{ x: 4 }}
                                    >
                                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-400 text-sm">{idx + 1}</span>
                                      </div>
                                      <p className="text-gray-300">{feature}</p>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Project Links */}
                            <div className="mt-8 flex flex-wrap gap-4">
                              <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-6 py-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center gap-3">
                                  <Github className="h-6 w-6 text-white group-hover:text-green-400 transition-colors" />
                                  <div>
                                    <p className="text-white font-medium">View Source Code</p>
                                    <p className="text-gray-400 text-sm">Check out the implementation</p>
                                  </div>
                                </div>
                              </motion.a>

                              {project.demoUrl && (
                                <motion.a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 px-6 py-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300 group"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-center gap-3">
                                    <ExternalLink className="h-6 w-6 text-white group-hover:text-green-400 transition-colors" />
                                    <div>
                                      <p className="text-white font-medium">Live Demo</p>
                                      <p className="text-gray-400 text-sm">Try it out yourself</p>
                                    </div>
                                  </div>
                                </motion.a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
            
            {/* Projects Navigation Dots */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-30">
              {projects.map((project, index) => (
                <motion.button
                  key={`nav-${project.id}`}
                  className="group flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  onClick={() => {
                    const element = document.getElementById(`project-${project.id}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full bg-white/50 group-hover:bg-green-400 transition-colors duration-300"
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <div className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-out">
                    <span className="whitespace-nowrap pl-3 text-white/70 group-hover:text-green-400">
                      {project.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
          
          {/* Contact Section */}
          <motion.section
            className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
              {/* Large gradient circle */}
              <motion.div
                className="absolute w-full h-full opacity-20 pointer-events-none"
                animate={{
                  background: [
                    'radial-gradient(circle at 30% 40%, rgba(74, 222, 128, 0.4) 0%, rgba(0, 0, 0, 0) 50%)',
                    'radial-gradient(circle at 70% 60%, rgba(74, 222, 128, 0.4) 0%, rgba(0, 0, 0, 0) 50%)',
                    'radial-gradient(circle at 30% 60%, rgba(74, 222, 128, 0.4) 0%, rgba(0, 0, 0, 0) 50%)',
                  ],
                }}
                transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
              />
              
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>
            
            {/* Section content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
              {/* Section title */}
              <motion.h2
                className="text-4xl md:text-6xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Get In Touch
              </motion.h2>
              
              <motion.p
                className="text-lg text-gray-400 text-center max-w-2xl mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Feel free to reach out to me for collaboration opportunities, project inquiries, or just to say hello!
              </motion.p>
              
              {/* Contact cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
                {[
                  {
                    title: "Email",
                    value: "s.aboulhamam@gmail.com",
                    icon: <Mail className="h-6 w-6 text-green-400" />,
                    link: "mailto:s.aboulhamam@gmail.com"
                  },
                  {
                    title: "LinkedIn",
                    value: "Connect with me",
                    icon: <Linkedin className="h-6 w-6 text-green-400" />,
                    link: "https://www.linkedin.com/in/soufiane-aboulhamam-955b471a3/"
                  },
                  {
                    title: "GitHub",
                    value: "Check my repositories",
                    icon: <Github className="h-6 w-6 text-green-400" />,
                    link: "https://github.com/soufianeabou"
                  }
                ].map((contact, idx) => (
                  <motion.a
                    key={contact.title}
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-8 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 hover:border-green-500/30 transition-all group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <div className="mb-4 p-4 rounded-full bg-black/50 group-hover:bg-green-500/10 transition-colors">
                      {contact.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                    <p className="text-gray-400 text-center group-hover:text-green-400 transition-colors">{contact.value}</p>
                  </motion.a>
                ))}
              </div>
              
              {/* Footer */}
              <motion.div
                className="w-full text-center border-t border-white/10 pt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} Soufiane Aboulhamam. All rights reserved.
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  Built with React, Next.js, Framer Motion, and Tailwind CSS
                </p>
              </motion.div>
            </div>
          </motion.section>
        </>
      )}
    </div>
  );
}