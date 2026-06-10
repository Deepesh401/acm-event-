import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Code2, ExternalLink } from 'lucide-react'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import GlassCard from '../components/ui/GlassCard'
import { projects } from '../data/staticData'
import { useFetch } from '../hooks/useFetch'

const categories = ['all', 'ai-ml', 'web-development', 'iot', 'open-source', 'research']
const catLabels = {
  'ai-ml': 'AI/ML',
  'web-development': 'Web Development',
  iot: 'IoT',
  'open-source': 'Open Source',
  research: 'Research',
}

export default function Projects() {
  const [category, setCategory] = useState('all')
  const { data } = useFetch('projects', { limit: 20 }, projects)

  const filtered = category === 'all' ? data : data.filter((p) => p.category === category)

  return (
    <>
      <SEO title="Projects" description="Student projects from NMIMS Indore ACM Student Chapter." />
      <PageHero badge="Showcase" title="Project Showcase" subtitle="Innovation built by our members." />

      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  category === cat ? 'bg-acm-blue text-white' : 'glass'
                }`}
              >
                {cat === 'all' ? 'All' : catLabels[cat]}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <GlassCard key={p._id} className="flex flex-col">
                <span className="text-xs font-bold uppercase text-acm-blue mb-2">{catLabels[p.category]}</span>
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1">{p.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.technologies?.map((t) => (
                    <span key={t} className="px-2 py-1 text-xs rounded-lg bg-acm-blue/10 text-acm-blue">{t}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-acm-blue">
                      <Code2 className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-acm-blue">
                      <ExternalLink className="w-4 h-4" /> Demo
                    </a>
                  )}
                  <Link to={`/projects/${p.slug || p._id}`} className="text-sm text-acm-blue ml-auto font-semibold">
                    Details →
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug || p._id === slug) || projects[0]

  return (
    <>
      <SEO title={project.title} description={project.shortDescription} />
      <PageHero badge={catLabels[project.category]} title={project.title} subtitle={project.shortDescription} />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <p className="text-[var(--text-secondary)] mb-6">{project.description || project.shortDescription}</p>
          {project.stats && (
            <div className="flex gap-6 mb-6">
              <span>⭐ {project.stats.stars} stars</span>
              <span>🍴 {project.stats.forks} forks</span>
            </div>
          )}
          <Link to="/projects" className="text-acm-blue font-semibold">← Back to Projects</Link>
        </div>
      </section>
    </>
  )
}
