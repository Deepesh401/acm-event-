import React from 'react';
import { motion } from 'framer-motion';
import { ctaData, joinLink } from '../data';

export default function CTA() {
  return (
    <section id="join" className="relative w-full bg-gradient-to-b from-[#02050b] to-[#042C53] text-white px-6 sm:px-10 md:px-16 py-28 md:py-36 overflow-hidden text-center">
      
      {/* Decorative floating grids/glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#f5c800]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#f5c800]/20 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5c800]" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-300">
            Membership Drive 2026
          </span>
        </motion.div>

        {/* Animated Headline */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {ctaData.headline}
        </motion.h2>

        {/* Animated Subtext */}
        <motion.p
          className="text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {ctaData.subtext}
        </motion.p>

        {/* Animated Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <a
            href={joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#f5c800] text-black font-black uppercase tracking-[0.15em] text-xs sm:text-sm px-8 py-4 sm:px-10 sm:py-4.5 rounded-full shadow-[0_4px_20px_rgba(245,200,0,0.25)] hover:shadow-[0_4px_35px_rgba(245,200,0,0.5)] transition-all duration-300"
          >
            Apply Now
          </a>
        </motion.div>

      </div>
    </section>
  );
}
