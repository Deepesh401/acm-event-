import React from 'react';
import { motion } from 'framer-motion';
import { teamMembers, facultyCoordinators, coreTeam } from '../data';

// Custom inline SVG for LinkedIn since brands are removed in newer lucide-react
const LinkedInIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Team() {
  return (
    <section id="team" className="relative bg-[#050811] text-white px-6 sm:px-10 md:px-16 py-24 md:py-32 overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* FACULTY SECTION */}
        <div className="mb-20">
          <div className="text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5c800]" />
              <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                FACULTY ADVISORS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase">
              Faculty Coordinators
            </h2>
            <div className="h-[2px] w-20 bg-[#f5c800] mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {facultyCoordinators.map((member, idx) => (
              <motion.div
                key={idx}
                className="group bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/[0.03] hover:border-blue-500/25"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-[#f5c800] transition-colors duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1 tracking-wide line-clamp-1">
                  {member.name}
                </h3>
                <p className="text-[#f5c800] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3.5">
                  {member.role}
                </p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-blue-400 hover:scale-115 transition-all duration-200 mt-auto"
                  aria-label={`${member.name} LinkedIn Profile`}
                >
                  <LinkedInIcon className="w-4.5 h-4.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* STUDENT SECTION */}
        <div className="mb-20">
          {/* Section Header */}
          <div className="text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5c800]" />
              <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                EXECUTIVE BOARD
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase">
              Student Committee
            </h2>
            <div className="h-[2px] w-20 bg-[#f5c800] mt-4" />
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                className="group bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/[0.03] hover:border-blue-500/25"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.08, ease: "easeOut" }}
              >
                {/* Member Photo Container */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-[#f5c800] transition-colors duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </div>

                {/* Name */}
                <h3 className="text-sm sm:text-base font-bold text-white mb-1 tracking-wide line-clamp-1">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-[#f5c800] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3.5">
                  {member.role}
                </p>

                {/* LinkedIn Button */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-blue-400 hover:scale-115 transition-all duration-200 mt-auto"
                  aria-label={`${member.name} LinkedIn Profile`}
                >
                  <LinkedInIcon className="w-4.5 h-4.5" />
                </a>

              </motion.div>
            ))}
          </div>
        </div>

        {/* CORE LEADS SECTION */}
        <div>
          {/* Section Header */}
          <div className="text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5c800]" />
              <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                DEPARTMENT LEADS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase">
              Core Leads
            </h2>
            <div className="h-[2px] w-20 bg-[#f5c800] mt-4" />
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8">
            {coreTeam.map((member, idx) => (
              <motion.div
                key={idx}
                className="group bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/[0.03] hover:border-blue-500/25"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.08, ease: "easeOut" }}
              >
                {/* Member Photo Container */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-[#f5c800] transition-colors duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </div>

                {/* Name */}
                <h3 className="text-sm sm:text-base font-bold text-white mb-1 tracking-wide line-clamp-1">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-[#f5c800] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3.5">
                  {member.role}
                </p>

                {/* LinkedIn Button */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-blue-400 hover:scale-115 transition-all duration-200 mt-auto"
                  aria-label={`${member.name} LinkedIn Profile`}
                >
                  <LinkedInIcon className="w-4.5 h-4.5" />
                </a>

              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
