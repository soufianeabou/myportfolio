"use client";
import { useEffect, useRef } from 'react';

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Star, nebula, and planet data
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.05 + 0.02,
      twinkle: Math.random() * Math.PI * 2,
    }));
    const nebulae = [
      { x: width * 0.3, y: height * 0.4, r: 180, color: 'rgba(34,255,170,0.08)' },
      { x: width * 0.7, y: height * 0.7, r: 220, color: 'rgba(80,120,255,0.07)' },
      { x: width * 0.6, y: height * 0.2, r: 120, color: 'rgba(255,80,200,0.06)' },
    ];
    const planets = [
      { x: width * 0.15, y: height * 0.8, r: 32, color: 'rgba(120,180,255,0.18)', dx: 0.02, dy: 0.01 },
      { x: width * 0.85, y: height * 0.2, r: 18, color: 'rgba(255,255,255,0.12)', dx: -0.01, dy: 0.015 },
    ];

    let frame = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw nebulae
      nebulae.forEach(n => {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.filter = 'blur(16px)';
        ctx.fill();
        ctx.filter = 'none';
      });

      // Draw planets
      planets.forEach(p => {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.filter = 'blur(2px)';
        ctx.fill();
        ctx.filter = 'none';
        // Animate drift
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;
      });

      // Draw stars
      stars.forEach(s => {
        if (!ctx) return;
        const twinkle = Math.sin(frame * s.speed + s.twinkle) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r + twinkle * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.5 + twinkle * 0.5})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 4 + twinkle * 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      frame++;
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
} 