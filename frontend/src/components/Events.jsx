import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { events } from '../data';

export default function Events() {
  return (
    <section id="events" className="relative bg-[#050811] text-white px-6 sm:px-10 md:px-16 py-24 md:py-32 overflow-hidden">
      
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5c800]" />
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
              CHAPTER BOOTCAMPS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase">
            Upcoming Events
          </h2>
          <div className="h-[2px] w-20 bg-[#f5c800] mt-4" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden flex flex-col hover:bg-white/[0.04] hover:border-blue-500/30 shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
            >
              {/* Event Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-all duration-300" />
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                />
              </div>

              {/* Event Details Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow text-left">
                {/* Date Wrapper */}
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#f5c800]" />
                  <span>{event.date}</span>
                </div>

                {/* Event Title */}
                <h3 className="text-xl font-bold uppercase text-white mb-3 tracking-wide group-hover:text-[#f5c800] transition-colors duration-200">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                  {event.description}
                </p>

                {/* Action CTA Button */}
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-white group-hover:text-[#f5c800] transition-colors mt-auto border border-white/10 group-hover:border-[#f5c800]/30 px-4 py-2.5 rounded-lg bg-black/20 group-hover:bg-[#f5c800]/5"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
