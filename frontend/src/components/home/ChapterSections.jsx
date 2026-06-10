import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import PersonCard, { SpeakerCard } from '../ui/PersonCard'
import GlassCard from '../ui/GlassCard'
import {
  facultyCoordinators,
  organizingCommittee,
  speakers,
  partners,
  chapterInfo,
  galleryItems,
} from '../../data/staticData'

const InstagramIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function PartnersSection() {
  return (
    <section className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-wide">
        <SectionHeader
          label="Affiliations"
          title="Our Partners & Affiliations"
          subtitle="Proudly associated with ACM India, ACM-W, and leading institutions."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-4 sm:p-8 overflow-x-auto"
        >
          <img
            src="/images/partners-logos.png"
            alt="ACM NMIMS Indore, ACM India Council, ACM-W India partners"
            className="w-full min-w-[600px] h-auto object-contain mx-auto"
            loading="lazy"
          />
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="text-center py-4 px-2 !p-4">
                <p className="text-[10px] sm:text-xs font-bold text-acm-blue uppercase tracking-wide mb-1">{p.short}</p>
                <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] leading-tight">{p.name}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FacultySection({ showCommittee = true }) {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeader
          label="Guidance"
          title="Faculty Coordinators"
          subtitle="Dedicated mentors guiding our chapter's vision and growth."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {facultyCoordinators.map((person, i) => (
            <PersonCard key={person.name} person={person} index={i} variant="featured" />
          ))}
        </div>

        {showCommittee && (
          <div className="mt-16 sm:mt-20">
            <SectionHeader
              label="Leadership"
              title="Organizing Committee Chairs"
              subtitle="Distinguished leaders shaping ACM initiatives across institutions."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {organizingCommittee.map((person, i) => (
                <PersonCard key={person.name} person={person} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function SpeakersSection() {
  return (
    <section className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-wide">
        <SectionHeader
          label="Distinguished Guests"
          title="Speakers"
          subtitle="Industry leaders and academicians who have graced our events."
        />
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {speakers.map((speaker, i) => (
            <SpeakerCard key={speaker.name} speaker={speaker} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function InstagramSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeader
          label="Social"
          title="Follow Us on Instagram"
          subtitle="Stay updated with events, workshops, and chapter moments."
        />

        <div className="text-center mt-6">
          <a
            href={chapterInfo.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold text-sm hover:shadow-lg hover:shadow-pink-500/25 transition-all"
          >
            <InstagramIcon className="w-5 h-5" />
            @acm_nmimsindore
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
