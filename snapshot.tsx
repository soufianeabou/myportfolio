"use client";

import { useState, useEffect, useRef } from "react";
import { Linkedin, Download, Mail, ArrowDown, ExternalLink, Github } from "lucide-react";

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDevice, setActiveDevice] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const starfieldRef = useRef(null);

  // Mock project data
  const projects = [
    {
      id: "laptop1",
      title: "E-Commerce Dashboard",
      description: "Full-stack application with real-time analytics and inventory management.",
      tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
      device: "laptop",
      images: ["/api/placeholder/800/500", "/api/placeholder/800/500"]
    },
    {
      id: "phone1",
      title: "Fitness Tracker App",
      description: "Mobile-first PWA with workout plans and progress tracking.",
      tech: ["Angular", "Firebase", "Bootstrap"],
      device: "phone",
      images: ["/api/placeholder/375/667", "/api/placeholder/375/667"]
    },
    {
      id: "tablet1",
      title: "AI Content Generator",
      description: "Tool that leverages machine learning to create custom content.",
      tech: ["Python", "TensorFlow", "React", "FastAPI"],
      device: "tablet",
      images: ["/api/placeholder/700/1000", "/api/placeholder/700/1000"]
    },
    {
      id: "desktop1",
      title: "University Portal",
      description: "ERP solution for university administration and student management.",
      tech: ["SQL Server", "Node.js", "Angular", "Power BI"],
      device: "desktop",
      images: ["/api/placeholder/1200/800", "/api/placeholder/1200/800"]
    }
  ];

  // Basic initialization
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      // Create starfield after loading
      createStarfield();
    }, 1500);
  }, []);

  // Track mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      const section = Math.floor(window.scrollY / window.innerHeight);
      setCurrentSection(section);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Create the starfield effect
  const createStarfield = () => {
    if (!starfieldRef.current) return;
    
    const starfield = starfieldRef.current;
    const starsCount = 200;
    
    for (let i = 0; i < starsCount; i++) {
      const star = document.createElement('div');
      
      // Random positions
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 0.2 + 0.1; // Between 0.1 and 0.3
      const duration = Math.random() * 3 + 2; // Between 2 and 5 seconds
      const delay = Math.random() * 5; // Random delay between 0 and 5 seconds
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;
      
      star.classList.add('star');
      starfield.appendChild(star);
    }
  };

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}>
      {/* Starfield Background */}
      <div ref={starfieldRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Moving Gradient Orbs */}
      <div 
        className="fixed top-1/4 -left-40 w-96 h-96 rounded-full bg-gradient-radial from-green-500/10 to-transparent blur-3xl"
        style={{ 
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
        }}
      />
      <div 
        className="fixed bottom-1/4 -right-40 w-96 h-96 rounded-full bg-gradient-radial from-blue-500/10 to-transparent blur-3xl"
        style={{ 
          transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px)`
        }}
      />
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10" 
        style={{ 
          backgroundImage: "linear-gradient(90deg, rgba(74, 222, 128, 0.4) 1px, transparent 1px), linear-gradient(rgba(74, 222, 128, 0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: "transform 0.2s ease-out"
        }} 
      />
      
      {/* Light Beams */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-green-500/20 to-transparent rotate-15 animate-pulse-slow"></div>
        <div className="absolute top-0 right-1/4 w-1/2 h-full bg-gradient-to-b from-blue-500/20 to-transparent -rotate-15 animate-pulse-slow delay-1000"></div>
      </div>
      
      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        // Create patterns, not completely random
        const angle = (i / 20) * Math.PI * 2;
        const distance = 30 + Math.random() * 30;
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;
        
        return (
          <div
            key={i}
            className="fixed rounded-full bg-green-500 opacity-40 animate-float"
            style={{
              width: `${Math.floor(Math.random() * 4) + 1}px`,
              height: `${Math.floor(Math.random() * 4) + 1}px`,
              top: `${y}%`,
              left: `${x}%`,
              filter: "blur(1px)",
              animationDuration: `${5 + i % 5}s`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        );
      })}

      {/* Header Controls */}
      <div className="fixed top-6 right-6 flex space-x-4 p-4 items-center z-50 backdrop-blur-sm bg-black/10 rounded-full">
        <a 
          href="https://www.linkedin.com/in/soufiane-aboulhamam-955b471a3/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group"
        >
          <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
        </a>
        <button 
          className={`relative w-14 h-7 rounded-full ${darkMode ? "bg-green-500" : "bg-gray-300"} transition-colors duration-300`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <div 
            className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all duration-500 transform"
            style={{ 
              left: darkMode ? "calc(100% - 24px)" : "4px",
              boxShadow: darkMode ? "0 0 10px rgba(74, 222, 128, 0.5)" : "none" 
            }}
          />
        </button>
      </div>

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center relative">
            {/* Animated Circles */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 rounded-full border border-green-500 -translate-x-1/2 -translate-y-1/2 animate-ping-slow"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.3 - i * 0.05
                }}
              ></div>
            ))}
            
            {/* Particle Explosion */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const radius = Math.random() * 200 + 100;
              const delay = 1 + Math.random();
              
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full animate-particle-explosion"
                  style={{
                    '--end-x': `${Math.cos(angle) * radius}px`,
                    '--end-y': `${Math.sin(angle) * radius}px`,
                    '--delay': `${delay}s`,
                    animationDelay: `${delay}s`
                  }}
                ></div>
              );
            })}
            
            {/* Name Text with Glow */}
            <div className="text-5xl sm:text-6xl md:text-7xl text-white font-bold animate-glow-text">
              SOUFIANE ABOULHAMAM
            </div>
          </div>
        </div>
      )}

      {/* Custom Section Navigation */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-6">
        {[0, 1, 2, 3].map(i => (
          <button 
            key={i}
            className="group flex items-center"
            onClick={() => window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })}
          >
            <div className="w-2 h-10 rounded-full bg-gray-600 group-hover:bg-green-500 transition-all duration-300 mr-2 overflow-hidden">
              <div 
                className={`h-full w-full bg-green-500 transition-all duration-500 origin-bottom ${
                  i === currentSection ? "scale-y-100" : "scale-y-0"
                }`}
              ></div>
            </div>
            <span 
              className={`text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 ${
                i === currentSection ? "text-green-500" : "text-gray-400"
              }`}
            >
              {i === 0 ? "Home" : i === 1 ? "About" : i === 2 ? "Skills" : "Projects"}
            </span>
          </button>
        ))}
      </div>

      {/* First Section - Hero */}
      <section className="h-screen flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div 
          className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div 
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        
        {/* Content with Staggered Entrance */}
        <div className="relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 transition-transform">
            <div className="overflow-hidden">
              <span className="text-green-500 inline-block hover:scale-105 transition-transform animate-slide-in" style={{ animationDelay: "0.3s" }}>
                Web Developer
              </span>
            </div>
            <div className="overflow-hidden mt-2">
              <span className="inline-block animate-slide-in" style={{ animationDelay: "0.5s" }}>
                AI Enthusiast | ERP Developer
              </span>
            </div>
          </h1>
          
          <div className="overflow-hidden">
            <p className="text-gray-400 max-w-xl mb-10 animate-slide-in" style={{ animationDelay: "0.7s" }}>
              Passionate about creating scalable, high-performance solutions with cutting-edge technologies
              and elegant user experiences.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-5 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center hover:shadow-neon transition-all duration-300 group">
              <Download className="mr-3 group-hover:scale-110 transition-transform" /> 
              <span className="group-hover:translate-x-1 transition-transform">Download CV</span>
            </button>
            <button className="px-8 py-4 bg-black/30 backdrop-blur-md border border-green-500 text-green-400 rounded-xl flex items-center hover:bg-green-500/10 transition-all duration-300 group">
              <Mail className="mr-3 group-hover:scale-110 transition-transform" /> 
              <span className="group-hover:translate-x-1 transition-transform">Contact Me</span>
            </button>
          </div>
        </div>
        
        {/* Stats with Parallax Effect */}
        <div 
          className="absolute bottom-10 right-10 md:right-24 text-right"
          style={{ 
            transform: `translateY(${mousePosition.y * -20}px)`,
            transition: "transform 0.7s ease-out"
          }}
        >
          <div className="overflow-hidden">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 animate-slide-in" style={{ animationDelay: "0.8s" }}>3+</h2>
          </div>
          <p className="text-lg text-gray-300">Projects</p>
          <div className="overflow-hidden mt-2">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 animate-slide-in" style={{ animationDelay: "1s" }}>10+</h2>
          </div>
          <p className="text-lg text-gray-300">Stacks</p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="w-8 h-12 border-2 border-green-500 rounded-full flex justify-center p-2">
            <div className="w-1 bg-green-500 rounded-full animate-scroll-down"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 animate-pulse">SCROLL DOWN</p>
        </div>
      </section>

      {/* Second Section - About */}
      <section className="h-screen flex flex-col justify-center items-center px-8 relative">
        {/* Interactive Background */}
        <div className="absolute inset-0 flex justify-center">
          <div 
            className="w-full h-full bg-gradient-radial from-green-900/10 to-transparent opacity-50"
            style={{ 
              transform: `scale(${1 + mousePosition.y * 0.1}) translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
              transition: "transform 1s ease-out"
            }}
          ></div>
        </div>
        
        {/* Glowing Accent Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-width-pulse"></div>
          <div className="absolute bottom-1/4 right-0 w-1/2 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-width-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl w-full">
          {/* Animated Title */}
          <div className="text-center mb-12 overflow-hidden">
            <h2 className="text-5xl font-bold inline-block relative animate-slide-in-delayed">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Soufiane</span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-width-pulse"></div>
            </h2>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-gray-800 hover:border-green-500/30 transition-all duration-500 shadow-lg">
            <p className="text-gray-300 text-center text-lg leading-relaxed">
              I am Soufiane Aboulhamam, 22 years old, graduate from Al Akhawayn University with a Bachelor's in
              Computer Science. Now an ERP Developer at the same university. (They liked me so much they kept me!)
              My passion lies in creating elegant solutions to complex problems while maintaining a focus on user experience.
            </p>
          </div>
          
          {/* Enhanced Timeline with Animation */}
          <div className="relative mt-16">
            {/* Timeline Line with Pulse Animation */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-green-500/20 via-green-500 to-green-500/20 animate-pulse-slow"></div>
            
            {/* Timeline Points */}
            <div className="flex justify-between">
              {[
                {
                  title: "ERP Administrator",
                  time: "09/2024 - Present",
                  place: "AI Akhawayn University"
                },
                {
                  title: "Resident Assistant",
                  time: "10/2022 - 06/2024",
                  place: "AI Akhawayn University"
                },
                {
                  title: "Software Developer Intern",
                  time: "06/2023 - 08/2023",
                  place: "Marsa Maroc"
                },
                {
                  title: "IT Intern",
                  time: "08/2021 - 09/2021",
                  place: "Inteleia IT Solutions"
                }
              ].map((entry, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Dot with Ripple Effect */}
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-300 group-hover:scale-150">
                    <div className="absolute inset-0 rounded-full bg-green-500 animate-ping-slow opacity-60 group-hover:opacity-100"></div>
                  </div>
                  
                  {/* Timeline Content with 3D Effect on Hover */}
                  <div 
                    className={`absolute w-52 transition-all duration-500 group-hover:transform group-hover:scale-105 ${
                      index % 2 === 0 ? "-translate-y-full -top-8 text-right" : "translate-y-0 top-8"
                    }`}
                  >
                    <div className="bg-black/40 backdrop-blur-md p-5 rounded-xl border border-gray-800 group-hover:border-green-500/50 group-hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-green-400 transition-colors">{entry.title}</h3>
                      <p className="text-sm text-gray-400">{entry.time}</p>
                      <p className="text-sm text-gray-400">{entry.place}</p>
                    </div>
                    
                    {/* Connecting Line */}
                    <div 
                      className={`absolute h-8 w-px bg-green-500/50 left-1/2 ${
                        index % 2 === 0 ? "bottom-0 translate-y-full" : "top-0 -translate-y-full"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Third Section - Skills */}
      <section className="h-screen flex flex-col justify-center items-center px-8 relative">
        {/* Interactive Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-green-900/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-blue-900/10 to-transparent"></div>
        </div>
        
        {/* Grid with Parallax Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{ 
            backgroundImage: "linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px), linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
            transition: "transform 0.5s ease-out"
          }}
        ></div>
        
        <div className="relative z-10 max-w-6xl w-full">
          {/* Section Title with Animation */}
          <div className="text-center mb-16 overflow-hidden">
            <h2 className="text-5xl font-bold inline-block relative animate-fade-in-up">
              <span className="relative">
                Skills
                <span className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-width-pulse"></span>
              </span>
            </h2>
          </div>
          
          {/* Skills Grid with Staggered Animations */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
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
            ].map((skill, index) => (
              <div
                key={index}
                className="skill-card flex flex-col items-center justify-center p-6 bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all duration-300 group"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="relative mb-4 group-hover:transform group-hover:scale-110 transition-all duration-300">
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-14 h-14 z-10 relative"
                  />
                  <div className="absolute inset-0 bg-green-500/20 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: "scale(1.2)" }}></div>
                </div>
                <p className="text-base font-medium text-center group-hover:text-green-400 transition-colors">{skill.name}</p>
              </div>
            ))}
          </div>
          
          {/* Text Skills with Animation */}
          <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <p className="text-xl text-gray-300">
              I also excel in 
              <span className="relative inline-block mx-2">
                <span className="text-green-400 italic">Agile Methodologies, Teamwork, Communication</span>
                <span className="absolute -bottom-1 left-0 w-full h-px bg-green-500/50"></span>
              </span>
              which are essential for delivering high-quality projects.
            </p>
          </div>
        </div>
      </section>

      {/* Fourth Section - Projects */}
      <section className="h-screen flex flex-col items-center justify-center px-8 relative">
        {/* 3D Office Environment */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Desk Surface with 3D Effect */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-900 via-gray-800/80 to-transparent transform-gpu perspective">
            <div className="absolute inset-x-0 top-0 h-px bg-green-500/20"></div>
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 50% 0%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)",
                transform: `rotateX(60deg) translateZ(-50px) translateY(${mousePosition.y * 10}px)`,
                transition: "transform 0.5s ease-out"
              }}
            ></div>
          </div>
          
          {/* Atmospheric Light Effects */}
          <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-blue-800/10 via-blue-500/5 to-transparent"></div>
          <div className="absolute right-1/4 top-1/3 w-80 h-80 rounded-full bg-gradient-radial from-yellow-500/10 to-transparent filter blur-3xl animate-pulse-slow"></div>
        </div>
        
        {/* Section Title with Animation */}
        <div className="text-center mb-12 z-10 overflow-hidden">
          <h2 className="text-5xl font-bold inline-block relative animate-fade-in-up">
          <span className="relative">
              My Projects
              <span className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-width-pulse"></span>
            </span>
          </h2>
        </div>
        
        {/* Projects Grid with 3D Perspective */}
        <div className="relative z-10 max-w-6xl w-full perspective">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 transform-gpu"
            style={{
              transform: `rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
              transition: "transform 0.5s ease-out"
            }}
          >
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="project-card relative bg-black/50 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] transition-all duration-500 cursor-pointer transform hover:scale-[1.03] hover:z-20"
                onClick={() => setActiveDevice(project.id)}
                style={{ 
                  animationDelay: `${0.3 + index * 0.2}s`,
                  transform: `translateZ(${index * 10}px)`
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-950 overflow-hidden group">
                  {/* Device Mockup with Realistic Reflections */}
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/5 z-10"></div>
                    
                    {/* Device Container */}
                    <div className={`relative ${
                      project.device === "desktop" ? "w-4/5 h-2/3" : 
                      project.device === "laptop" ? "w-3/4 h-1/2" : 
                      project.device === "tablet" ? "w-1/3 h-3/4" : 
                      "w-1/5 h-3/4"
                    }`}>
                      {/* Device Frame with Reflection */}
                      <div className={`absolute inset-0 bg-gray-700 ${
                        project.device === "phone" || project.device === "tablet" ? "rounded-lg" : "rounded-t-lg"
                      } border border-gray-600 overflow-hidden shadow-lg`}>
                        {/* Screen Content */}
                        <div className="absolute inset-[1px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                          {/* Screen Glare */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent transform -rotate-45"></div>
                          
                          {/* Call to Action */}
                          <div className="relative z-10 text-center">
                            <span className="text-gray-400 text-sm group-hover:text-green-400 transition-colors">Click to view</span>
                            <div className="mt-2 w-6 h-6 rounded-full border border-green-500/50 flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-4 h-4 bg-green-500/30 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Device Stand/Base */}
                      {project.device === "desktop" && (
                        <>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-3 bg-gray-800 z-20"></div>
                          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-2 bg-gray-900 rounded-lg z-10"></div>
                        </>
                      )}
                      
                      {project.device === "laptop" && (
                        <div className="absolute -bottom-1 w-full h-1 bg-gray-800 transform skew-x-12 z-10"></div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Project Details with Hover Effects */}
                <div className="p-6 relative">
                  {/* Background Accent */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-black/60 text-green-400 rounded-full text-xs">
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-black/60 text-green-400 rounded-full text-xs">
                        +{project.tech.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* Bottom Corner Accent */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-green-500/20 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Project Modal with Animations */}
      {activeDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <div 
            className="absolute inset-0 backdrop-blur-xl bg-black/90 animate-fade-in"
            onClick={() => setActiveDevice(null)}
          ></div>
          
          {/* Modal Container with 3D Effect */}
          <div className="relative max-w-6xl w-full h-[85vh] bg-black/60 backdrop-blur-md rounded-2xl overflow-hidden border border-green-500/30 shadow-[0_0_50px_rgba(74,222,128,0.15)] animate-scale-up">
            {/* Ambient Light Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5"></div>
              <div className="absolute top-0 left-1/3 w-1/3 h-1/3 bg-gradient-radial from-green-500/10 to-transparent rounded-full filter blur-3xl animate-pulse-slow"></div>
            </div>
            
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-green-500/30 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-green-500/30 rounded-br-2xl"></div>
            
            {/* Close Button with Animation */}
            <button 
              className="absolute top-6 right-6 z-50 p-3 bg-black/60 rounded-full text-white hover:bg-green-500/20 transition-all duration-300 hover:rotate-90 hover:scale-110 border border-gray-700 hover:border-green-500/50 group"
              onClick={() => setActiveDevice(null)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" className="group-hover:stroke-green-400 transition-colors">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row h-full w-full">
              {/* Image Gallery with Effects - 60% */}
              <div className="w-full md:w-3/5 h-1/2 md:h-full relative overflow-hidden group">
                {/* Main Image with Parallax Effect */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={projects.find(p => p.id === activeDevice)?.images[0]} 
                    alt={projects.find(p => p.id === activeDevice)?.title} 
                    className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-110"
                    style={{ 
                      transform: `scale(1.05) translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
                      transition: "transform 0.5s ease-out"
                    }}
                  />
                </div>
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10"></div>
                
                {/* Glowing Corner Accents */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-green-500/50 rounded-tl-lg"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-green-500/50 rounded-br-lg"></div>
                
                {/* Navigation Controls with Hover Effect */}
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-3 bg-black/60 rounded-full text-white backdrop-blur-sm hover:bg-green-500/60 transition-colors transform hover:-translate-x-1">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" strokeWidth="2" fill="none">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button className="p-3 bg-black/60 rounded-full text-white backdrop-blur-sm hover:bg-green-500/60 transition-colors transform hover:translate-x-1">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" strokeWidth="2" fill="none">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {projects.find(p => p.id === activeDevice)?.images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`relative h-16 w-24 rounded-md overflow-hidden ${
                        idx === 0 ? 'ring-2 ring-green-500 scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'
                      } transition-all duration-300`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Details with Staggered Animations - 40% */}
              <div className="w-full md:w-2/5 h-1/2 md:h-full p-8 flex flex-col bg-gradient-to-b from-gray-900/80 to-black/90 overflow-auto">
                {/* Project Title with Animation */}
                <div className="overflow-hidden">
                  <h3 className="text-3xl font-bold mb-2 text-white animate-slide-in" style={{ animationDelay: "0.3s" }}>
                    {projects.find(p => p.id === activeDevice)?.title}
                  </h3>
                </div>
                
                {/* Project Type Indicator */}
                <div className="flex items-center text-green-500 mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-green-500 to-green-500/30 mr-4"></div>
                  <span className="text-sm uppercase tracking-wider">
                    {projects.find(p => p.id === activeDevice)?.device} Project
                  </span>
                </div>
                
                {/* Project Description */}
                <div className="bg-black/20 backdrop-blur-sm p-5 rounded-xl border border-gray-800 mb-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <p className="text-gray-300 leading-relaxed">
                    {projects.find(p => p.id === activeDevice)?.description}
                  </p>
                  <p className="text-gray-400 mt-4">
                    This project demonstrates my ability to create intuitive interfaces while maintaining robust
                    backend functionality. The solution provides real-time updates and responsive design
                    across all devices.
                  </p>
                </div>
                
                {/* Technologies Section */}
                <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                  <h4 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="w-5 h-5 mr-2 flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    Technologies
                  </h4>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {projects.find(p => p.id === activeDevice)?.tech.map((tech, idx) => (
                      <span 
                        key={tech} 
                        className="px-3 py-1.5 bg-green-900/20 text-green-400 rounded-full border border-green-500/20 hover:bg-green-900/40 hover:border-green-500/40 transition-colors cursor-default"
                        style={{ animationDelay: `${0.7 + idx * 0.1}s` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-auto flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.9s" }}>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center hover:shadow-neon transition-all duration-300 group">
                    <ExternalLink className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span className="group-hover:translate-x-1 transition-transform">Live Demo</span>
                  </button>
                  <button className="px-6 py-3 bg-black/30 backdrop-blur-sm border border-green-500 text-green-400 rounded-xl flex items-center hover:bg-green-500/10 transition-all duration-300 group">
                    <Github className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span className="group-hover:translate-x-1 transition-transform">View Code</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 z-40" style={{ width: `${scrollProgress}%` }} />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-delayed {
          0% { opacity: 0; transform: translateY(30px); }
          50% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(0.2); opacity: 0.6; }
          50% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        @keyframes width-pulse {
          0%, 100% { width: 20%; opacity: 0.5; }
          50% { width: 100%; opacity: 0.8; }
        }
        
        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 10px rgba(74, 222, 128, 0.5); }
          50% { text-shadow: 0 0 20px rgba(74, 222, 128, 0.8), 0 0 30px rgba(74, 222, 128, 0.6); }
        }
        
        @keyframes scroll-down {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
        
        @keyframes particle-explosion {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))); opacity: 0; }
        }
        
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s forwards;
        }
        
        .animate-slide-in-delayed {
          animation: slide-in-delayed 1.5s forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s forwards;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        
        .animate-width-pulse {
          animation: width-pulse 8s ease-in-out infinite;
        }
        
        .animate-glow-text {
          animation: glow-text 2s ease-in-out infinite;
        }
        
        .animate-scroll-down {
          animation: scroll-down 2s ease-in-out infinite;
        }
        
        .animate-particle-explosion {
          animation: particle-explosion var(--delay, 2s) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .animate-scale-up {
          animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 15s linear infinite;
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .perspective {
          perspective: 1000px;
        }
        
        .shadow-neon {
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        /* Starfield Animation */
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 4s infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        /* Skill Card Animation */
        .skill-card {
          animation: appear 0.6s forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes appear {
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Project Card Animation */
        .project-card {
          animation: appear-delayed 0.8s forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        
        @keyframes appear-delayed {
          0% { opacity: 0; transform: translateY(30px); }
          30% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}