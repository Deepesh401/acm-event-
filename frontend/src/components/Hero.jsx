import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import heroVideo from '../assets/hero.mp4';

// Fallback high-quality background video URL if local video is empty or fails
const FALLBACK_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4";

export default function Hero() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const [videoSrc, setVideoSrc] = useState(heroVideo);

  // Twinkling & Mouse-Reactive Particle Constellation (Canvas-based)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < Math.min(starCount, 120); i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.6,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          vx: (Math.random() - 0.5) * 0.25, // slow drift velocity
          vy: (Math.random() - 0.5) * 0.25,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Apply slow drift motion
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around boundaries
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Mouse connection and push logic
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = star.x - mouseRef.current.x;
          const dy = star.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            // Draw connection lines to mouse cursor (using blue tone matching theme)
            ctx.strokeStyle = `rgba(0, 93, 170, ${(1 - dist / 180) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();

            // Gently push stars away from mouse
            const force = (180 - dist) / 180;
            const angle = Math.atan2(dy, dx);
            star.x += Math.cos(angle) * force * 1.2;
            star.y += Math.sin(angle) * force * 1.2;
          }
        }

        // Pulse opacity
        star.phase += star.pulseSpeed;
        const opacity = 0.15 + (Math.sin(star.phase) + 1) * 0.35;

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle Video Errors
  const handleVideoError = () => {
    console.warn("Local hero.mp4 not loaded or empty. Falling back to CDN video.");
    setVideoSrc(FALLBACK_VIDEO_URL);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  return (
    <section className="relative w-full h-screen bg-[#050811] overflow-hidden select-none">

      {/* 1. Background Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        onError={handleVideoError}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. Twinkling & Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />


      {/* 4. UI Layout Layer */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-10 md:p-14 z-40">

        {/* Spacer to replace duplicate header */}
        <div />

        {/* HERO SPLIT GRID CONTENT */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end mt-auto">

          {/* Left side content (col-span 7) */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-4">
              <div>Defining the</div>
              <div className="mt-0.5">future of</div>
              <div className="mt-2 inline-block bg-[#005daa] text-white px-3 py-1 font-black text-lg sm:text-xl md:text-2xl lg:text-3xl rounded-sm">
                computing innovation.
              </div>
            </h1>

            <div className="flex flex-wrap gap-3 mt-1">
              <a
                href="#events"
                className="px-5 py-2.5 bg-[#005daa] text-white font-black rounded-lg text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-white/20"
              >
                Explore Events
              </a>
              <a
                href="#join"
                className="px-5 py-2.5 border border-white/20 text-white font-black rounded-lg text-xs sm:text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300"
              >
                Join ACM
              </a>
            </div>
          </div>

          {/* Right side content (col-span 5) */}
          <div className="md:col-span-5 flex flex-col items-start md:items-end text-left md:text-right mt-4 md:mt-0">
            <div className="text-[#005daa] font-black text-xl sm:text-2xl tracking-wider uppercase mb-0.5">
              EST. 2025
            </div>
            <div className="text-white font-extrabold text-xs sm:text-sm md:text-base tracking-widest uppercase mb-0.5">
              ACM Student Chapter
            </div>
            <div className="text-neutral-400 font-bold text-[10px] sm:text-xs tracking-widest uppercase">
              NMIMS Indore
            </div>
          </div>

        </div>

        {/* BOTTOM: Scroll Indicator */}
        <div className="w-full flex justify-center mt-6">
          <a href="#about" className="flex flex-col items-center gap-1.5 group cursor-pointer">

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="text-[#005daa] w-4 h-4 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </a>
        </div>

      </div>
    </section>
  );
}
