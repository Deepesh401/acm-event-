import React from 'react';
import { motion } from 'framer-motion';
import { introData, chapterName } from '../data';

export default function Intro() {
  return (
    <section id="about" className="relative bg-[#050811] text-white px-6 sm:px-10 md:px-16 py-24 md:py-32 overflow-hidden">
      
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: Texts */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-start text-left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Est. Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/25 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005daa] animate-pulse" />
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
              {introData.tagline}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase mb-6 bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
            {introData.heading}
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
            {introData.introText}
          </p>
          
          <div className="h-[2px] w-24 bg-gradient-to-r from-[#005daa] to-blue-500 my-6" />

          <p className="text-neutral-500 text-xs sm:text-sm font-medium tracking-wide">
            Affiliated with the global {chapterName} network. Preserving tech legacy, scaling student innovation.
          </p>
        </motion.div>

        {/* RIGHT COLUMN: Interactive Illustration / Image Placeholder */}
        <motion.div
          className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] lg:h-[450px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Main Background Image Card with red glowing border */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent z-10 opacity-80" />
            <img
              src={introData.illustrationPlaceholder}
              alt="ACM Indore Community"
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
            
            {/* Ambient glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#005daa]/20 rounded-2xl transition-all duration-500 pointer-events-none z-20" />
          </div>

          {/* Floating Glassmorphic Terminal Overlay */}
          <motion.div
            className="absolute -bottom-6 -left-6 sm:bottom-4 sm:left-4 md:-left-8 bg-black/60 backdrop-blur-xl border border-white/15 rounded-xl p-4 w-72 sm:w-80 shadow-2xl z-20"
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#005daa]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-[10px] font-mono text-neutral-400 ml-2">indore-acm-chapter.sh</span>
            </div>

            {/* Terminal Code Content */}
            <div className="font-mono text-xs text-neutral-300 leading-relaxed text-left">
              <div className="text-blue-400 font-semibold">$ npm run init-legacy</div>
              <div className="text-neutral-500">&gt; Loading chapter databases... Done</div>
              <div className="text-neutral-500">&gt; Building local tech division... Done</div>
              <div className="text-[#005daa] mt-1 font-semibold">&gt; Status: ACTIVE (Est. 2025)</div>
              <div className="text-green-400">&gt; Ready for next hackathon!</div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
