import { useState } from 'react'
import { Code2, Share2 } from 'lucide-react'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import SectionHeader from '../components/ui/SectionHeader'
import { TeamCard } from '../components/ui/Cards'
import PersonCard from '../components/ui/PersonCard'
import { teamMembers, facultyCoordinators } from '../data/staticData'
import { useFetch } from '../hooks/useFetch'

const tabs = [
  { id: 'faculty', label: 'Faculty' },
  { id: 'all', label: 'All' },
  { id: 'chairperson', label: 'Leadership' },
  { id: 'core-committee', label: 'Core Committee' },
  { id: 'technical', label: 'Technical' },
]

export default function Team() {
  const [tab, setTab] = useState('all')
  const { data } = useFetch('team', { limit: 30 }, teamMembers)

  const filtered =
    tab === 'faculty'
      ? []
      : tab === 'all'
        ? data
        : tab === 'chairperson'
          ? data.filter((m) => ['chairperson', 'vice-chairperson'].includes(m.category))
          : data.filter((m) => m.category === tab)

  return (
    <>
      <SEO title="Team & Leadership" description="Meet the ACM NMIMS Indore leadership and core team." />
      <PageHero
        badge="Leadership"
        title="Team & Leadership"
        subtitle="The minds driving innovation at NMIMS Indore ACM."
        image="/images/team-group.png"
      />

      <section className="section-padding bg-[var(--bg-secondary)]">
        <div className="container-wide">
          <SectionHeader label="Guidance" title="Faculty Coordinators" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {facultyCoordinators.map((person, i) => (
              <PersonCard key={person.name} person={person} index={i} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader label="Students" title="Core Team" />

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
            {tabs.filter((t) => t.id !== 'faculty').map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  tab === t.id ? 'bg-acm-blue text-white shadow-lg shadow-acm-blue/25' : 'glass'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((member) => (
              <div key={member._id} className="relative group">
                <TeamCard member={member} />
                {(member.linkedin || member.github) && (
                  <div className="absolute bottom-20 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/20 backdrop-blur text-white">
                        <Share2 className="w-4 h-4" />
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/20 backdrop-blur text-white">
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
