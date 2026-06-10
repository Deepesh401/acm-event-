import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import EventCard from '../components/ui/Cards'
import { events } from '../data/staticData'
import { useFetch } from '../hooks/useFetch'

const categories = ['all', 'workshop', 'hackathon', 'seminar', 'competition', 'meetup', 'summit']

export default function Events() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { data, loading } = useFetch('events', { limit: 20 }, events)

  const filtered = data.filter((e) => {
    const matchCat = category === 'all' || e.category === category
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <SEO title="Events" description="ACM NMIMS Indore events archive and upcoming events." />
      <PageHero badge="Events Archive" title="Events" subtitle="Workshops, hackathons, summits, and more." />

      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                    category === cat ? 'bg-acm-blue text-white' : 'glass hover:bg-acm-blue/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-center text-[var(--text-secondary)]">Loading events...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((e) => (
                <EventCard key={e._id} event={e} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export function EventDetail() {
  const { slug } = useParams()
  const { data } = useFetch('events', {}, events)
  const event = data.find((e) => e.slug === slug || e._id === slug) || events[0]

  return (
    <>
      <SEO title={event.title} description={event.shortDescription} />
      <PageHero badge={event.category} title={event.title} subtitle={event.shortDescription} image={event.coverImage} />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8">{event.description || event.shortDescription}</p>
          {event.registrationCount !== undefined && (
            <p className="text-sm text-acm-blue font-medium">
              {event.registrationCount} registered
              {event.registrationLimit && ` / ${event.registrationLimit} spots`}
            </p>
          )}
          <Link to="/events" className="inline-block mt-6 text-acm-blue font-semibold">← Back to Events</Link>
        </div>
      </section>
    </>
  )
}
