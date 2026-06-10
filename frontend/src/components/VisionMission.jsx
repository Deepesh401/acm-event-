import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { vision, mission } from '../data';

// Helper component to render Lucide icons dynamically from a string name
const DynamicIcon = ({ name, className }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.Compass;
  return <IconComponent className={className} />;
};

export default function VisionMission() {
  const cards = [
    {
      ...vision,
      glowColor: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]',
      borderColor: 'group-hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400',
    },
    {
      ...mission,
      glowColor: 'group-hover:shadow-[0_0_40px_rgba(0,93,170,0.15)]',
      borderColor: 'group-hover:border-[#005daa]/40',
      iconBg: 'bg-[#005daa]/10 text-[#005daa]',
    }
  ];

  return (
    <section className="relative bg-[#02050b] text-white px-6 sm:px-10 md:px-16 py-20 overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`group relative bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-8 sm:p-10 text-left transition-all duration-500 hover:bg-white/[0.04] ${card.borderColor} ${card.glowColor}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              whileHover={{ y: -6 }}
            >
              {/* Card Icon Wrapper */}
              <div className={`inline-flex items-center justify-center p-4 rounded-xl mb-6 ${card.iconBg}`}>
                <DynamicIcon name={card.icon} className="w-8 h-8" />
              </div>

              {/* Card Title */}
              <h3 className="text-2xl font-bold uppercase tracking-wide mb-4 text-white">
                {card.title}
              </h3>

              {/* Card Text */}
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                {card.text}
              </p>

              {/* Decorative Corner Line */}
              <div className="absolute top-0 right-0 w-8 h-[1px] bg-white/10 group-hover:bg-[#005daa]/30 transition-colors" />
              <div className="absolute top-0 right-0 h-8 w-[1px] bg-white/10 group-hover:bg-[#005daa]/30 transition-colors" />
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
