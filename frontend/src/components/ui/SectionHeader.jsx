import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function SectionHeader({ label, title, subtitle, center = true, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(center && 'text-center', 'mb-12 md:mb-16', className)}
    >
      {label && (
        <span className="inline-block text-acm-blue font-semibold text-sm uppercase tracking-widest mb-3">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  )
}
