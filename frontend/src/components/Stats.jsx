import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { stats } from '../data';

const StatCard = ({ label, value, suffix, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }

    const duration = 1600; // Animation duration in milliseconds
    const totalSteps = 50; // Total frames of animation
    const increment = Math.ceil(end / totalSteps);
    const stepDuration = Math.max(duration / totalSteps, 20); // 20ms min interval

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [trigger, value]);

  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-[#032342] rounded-xl border border-white/5 shadow-lg overflow-hidden group">
      
      {/* Dynamic hover overlay border */}
      <div className="absolute inset-0 border border-transparent group-hover:border-[#005daa]/25 transition-all duration-300 rounded-xl pointer-events-none" />

      {/* Decorative dot decoration */}
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#005daa] transition-colors" />

      {/* Counted Number */}
      <div className="text-5xl sm:text-6xl font-black text-[#005daa] tracking-tight mb-3 tabular-nums drop-shadow-[0_4px_12px_rgba(0,93,170,0.15)]">
        {count}
        <span className="text-white font-medium text-4xl ml-0.5">{suffix}</span>
      </div>

      {/* Label */}
      <div className="text-neutral-300 text-xs sm:text-sm font-extrabold uppercase tracking-widest">
        {label}
      </div>

    </div>
  );
};

export default function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger the count-up once
    threshold: 0.15,   // Trigger when 15% of the section is visible
  });

  return (
    <section
      ref={ref}
      className="relative bg-[#042C53] text-white px-6 sm:px-10 md:px-16 py-20 overflow-hidden"
    >
      {/* Decorative ambient line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              trigger={inView}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
