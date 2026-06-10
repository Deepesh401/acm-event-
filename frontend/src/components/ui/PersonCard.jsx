import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import GlassCard from './GlassCard'
import { cn } from '../../lib/utils'

function getInitials(name) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function PersonCard({ person, index = 0, variant = 'faculty' }) {
  const isFeatured = variant === 'featured'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="h-full"
    >
      <GlassCard
        hover
        className={cn(
          'h-full flex flex-col items-center text-center p-5 sm:p-6',
          isFeatured && 'border-acm-blue/20 bg-gradient-to-b from-acm-blue/5 to-transparent'
        )}
      >
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mb-4 ring-2 ring-acm-blue/20 shadow-lg"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mb-4 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg',
              person.color || 'bg-gradient-to-br from-acm-blue to-acm-blue-dark'
            )}
          >
            {getInitials(person.name)}
          </div>
        )}

        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-acm-blue mb-2">
          {person.badge || person.role}
        </span>

        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug mb-2">
          {person.name}
        </h3>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
          {person.title}
        </p>

        {person.affiliation && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border-color)] w-full justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-acm-blue shrink-0" />
            <span className="text-[10px] sm:text-xs text-[var(--text-secondary)]">{person.affiliation}</span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}

export function SpeakerCard({ speaker, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <div className="text-center">
        {speaker.image ? (
          <div className="relative mx-auto w-full max-w-[220px] aspect-[4/5] mb-5 overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-acm-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className={cn(
            'relative mx-auto w-full max-w-[220px] aspect-[4/5] mb-5 rounded-3xl flex items-center justify-center shadow-xl',
            speaker.color || 'bg-gradient-to-br from-acm-blue to-acm-blue-dark'
          )}>
            <span className="text-4xl sm:text-5xl font-black text-white/90">{getInitials(speaker.name)}</span>
          </div>
        )}
        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-1 px-2">{speaker.name}</h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed px-2">{speaker.title}</p>
      </div>
    </motion.div>
  )
}
