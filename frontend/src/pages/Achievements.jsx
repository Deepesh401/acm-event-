import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'
import { achievements } from '../data/staticData'
import { useFetch } from '../hooks/useFetch'
import { format } from 'date-fns'

const catLabels = {
  competition: 'Competition Wins',
  hackathon: 'Hackathon Results',
  certification: 'Certifications',
  'acm-recognition': 'ACM Recognitions',
  award: 'Awards',
  participation: 'Participation',
}

export default function Achievements() {
  const { data } = useFetch('achievements', { limit: 20 }, achievements)

  return (
    <>
      <SEO title="Achievements & Awards" description="ACM NMIMS Indore achievements and recognitions." />
      <PageHero badge="Recognition" title="Achievements & Awards" subtitle="Celebrating excellence and innovation." />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader label="Dashboard" title="Achievement Overview" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'Total Awards', value: data.length },
              { label: 'Hackathons', value: data.filter((a) => a.category === 'hackathon').length },
              { label: 'ACM Recognition', value: data.filter((a) => a.category === 'acm-recognition').length },
              { label: 'Competitions', value: data.filter((a) => a.category === 'competition').length },
            ].map((s) => (
              <GlassCard key={s.label} className="text-center py-6">
                <p className="text-3xl font-black text-acm-blue">{s.value}</p>
                <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="space-y-4">
            {data.map((a) => (
              <GlassCard key={a._id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-acm-blue/10 flex items-center justify-center text-2xl shrink-0">🏆</div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase text-acm-blue">{catLabels[a.category] || a.category}</span>
                  <h3 className="text-lg font-bold">{a.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{a.organization} · {a.position}</p>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {format(new Date(a.date), 'MMM yyyy')}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
