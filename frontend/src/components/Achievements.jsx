import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { achievements } from '../data';

export default function Achievements() {
  return (
    <section id="achievements" className="relative bg-[#02050b] text-white px-6 sm:px-10 md:px-16 py-24 md:py-32 overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5c800]" />
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
              HALL OF FAME
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase">
            Featured Achievements
          </h2>
          <div className="h-[2px] w-20 bg-[#f5c800] mt-4" />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((item, idx) => (
            <motion.div
              key={idx}
              className="group relative bg-white/[0.01] border border-white/5 rounded-xl p-8 text-left transition-all duration-300 hover:bg-white/[0.03] hover:border-[#f5c800]/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              {/* Badge Tag */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block bg-[#f5c800] text-black font-extrabold text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-sm shadow-md">
                  {item.badge}
                </div>
                <Award className="text-neutral-600 group-hover:text-[#f5c800] transition-colors w-5 h-5" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-3 leading-snug group-hover:text-[#f5c800] transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-400 text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* Bottom line decor */}
              <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#f5c800]/0 to-transparent group-hover:via-[#f5c800]/25 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
