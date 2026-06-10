import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import EventCard from '../ui/Cards'
import { ProjectCard } from '../ui/Cards'
import Button from '../ui/Button'
import { events, projects, achievements } from '../../data/staticData'
import { useFetch } from '../../hooks/useFetch'
import GlassCard from '../ui/GlassCard'

export function UpcomingEvents() {
  const { data } = useFetch('events', { status: 'upcoming', limit: 3 }, events.filter((e) => e.status === 'upcoming'))

  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeader label="Events" title="Upcoming Events" subtitle="Join us at our next chapter events and workshops." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.length ? data : events).slice(0, 3).map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/events"><Button variant="outline">View All Events</Button></Link>
        </div>
      </div>
    </section>
  )
}

export function FeaturedProjects() {
  const { data } = useFetch('projects', { isFeatured: true, limit: 3 }, projects)

  return (
    <section className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-wide">
        <SectionHeader label="Innovation" title="Featured Projects" subtitle="Student-led projects pushing the boundaries of technology." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.slice(0, 3).map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/projects"><Button variant="outline">Explore Projects</Button></Link>
        </div>
      </div>
    </section>
  )
}

export function AchievementHighlights() {
  const { data } = useFetch('achievements', { isFeatured: true, limit: 4 }, achievements)

  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeader label="Recognition" title="Achievement Highlights" />
        <div className="grid md:grid-cols-2 gap-6">
          {data.slice(0, 4).map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, x: i % 2 ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-acm-blue/10 flex items-center justify-center text-acm-blue font-black text-lg shrink-0">
                  🏆
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{a.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{a.organization} · {a.position}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function JoinCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('acm_token'))
  }, [])

  return (
    <section className="section-padding">
      <div className="container-wide">
        <GlassCard className="relative overflow-hidden text-center py-16 px-6 bg-gradient-to-br from-acm-blue to-acm-blue-dark !border-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join ACM?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Become part of NMIMS Indore&apos;s most vibrant computing community. Learn, build, and lead.
            </p>
            {isLoggedIn ? (
              <Link to="/admin">
                <Button className="bg-white text-acm-blue hover:bg-blue-50">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/membership">
                <Button className="bg-white text-acm-blue hover:bg-blue-50">
                  Become a Member <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

export function VisionMission() {
  return (
    <section className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-wide">
        <SectionHeader label="Purpose" title="Vision & Mission" />
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <h3 className="text-2xl font-bold text-acm-blue mb-4">Our Vision</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              To be the premier student computing community at NMIMS Indore, fostering innovation and preparing members for global technology leadership while preserving ACM&apos;s rich legacy.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-2xl font-bold text-acm-blue mb-4">Our Mission</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              To advance computing as a science and profession through workshops, hackathons, research initiatives, and community engagement — empowering every student to innovate and excel.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
