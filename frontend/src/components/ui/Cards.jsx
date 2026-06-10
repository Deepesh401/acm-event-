import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
// Link used by EventCard and ProjectCard
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import GlassCard from './GlassCard'
import { cn } from '../../lib/utils'

export default function EventCard({ event, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      <GlassCard className="p-0 overflow-hidden h-full flex flex-col">
        {event.coverImage && (
          <div className="h-48 overflow-hidden">
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-acm-blue mb-2">
            {event.category}
          </span>
          <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">{event.title}</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-4 flex-1">
            {event.shortDescription || event.description}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)] mb-4">
            {event.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.date), 'MMM d, yyyy')}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            )}
          </div>
          <Link
            to={`/events/${event.slug || event._id}`}
            className="inline-flex items-center gap-2 text-acm-blue font-semibold hover:gap-3 transition-all"
          >
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export function ProjectCard({ project }) {
  const catLabels = {
    'ai-ml': 'AI/ML',
    'web-development': 'Web Dev',
    iot: 'IoT',
    'open-source': 'Open Source',
    research: 'Research',
  }
  return (
    <GlassCard className="h-full flex flex-col">
      <span className="text-xs font-semibold uppercase text-acm-blue mb-2">
        {catLabels[project.category] || project.category}
      </span>
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-[var(--text-secondary)] text-sm mb-4 flex-1">{project.shortDescription}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies?.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-1 text-xs rounded-lg bg-acm-blue/10 text-acm-blue font-medium">
            {t}
          </span>
        ))}
      </div>
      <Link to={`/projects/${project.slug || project._id}`} className="text-acm-blue font-semibold text-sm">
        View Project →
      </Link>
    </GlassCard>
  )
}

export function TeamCard({ member }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative rounded-2xl overflow-hidden aspect-[3/4] group"
    >
      <img
        src={member.image || '/images/logo.png'}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute top-4 left-4 text-white/80 text-xs font-bold uppercase tracking-widest">
        {member.category?.replace('-', ' ') || 'Core Team'}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-stroke text-5xl md:text-6xl font-black uppercase opacity-30 rotate-[-90deg] whitespace-nowrap">
          {member.role}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-acm-red font-bold text-sm uppercase tracking-wider mb-1">{member.role}</p>
        <h3 className="text-white text-xl font-bold">{member.name}</h3>
      </div>
    </motion.div>
  )
}
