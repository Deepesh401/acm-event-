import { Link, useParams } from 'react-router-dom'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import GlassCard from '../components/ui/GlassCard'
import { blogs } from '../data/staticData'
import { useFetch } from '../hooks/useFetch'
import { format } from 'date-fns'

export default function Blogs() {
  const { data } = useFetch('blogs', { isPublished: true, limit: 20 }, blogs)

  return (
    <>
      <SEO title="Blog & Newsletter" description="Technical blogs and event reports from ACM NMIMS Indore." />
      <PageHero badge="Insights" title="Blogs & Newsletter" subtitle="Stories, reports, and technical insights." />

      <section className="section-padding">
        <div className="container-wide grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((blog) => (
            <GlassCard key={blog._id} className="flex flex-col">
              <span className="text-xs font-bold uppercase text-acm-blue mb-2">{blog.category?.replace('-', ' ')}</span>
              <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1">{blog.excerpt}</p>
              <div className="flex justify-between items-center text-sm text-[var(--text-secondary)]">
                <span>{blog.author}</span>
                <span>{blog.publishedAt && format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
              </div>
              <Link to={`/blogs/${blog.slug || blog._id}`} className="mt-4 text-acm-blue font-semibold text-sm">
                Read More →
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  )
}

export function BlogDetail() {
  const { slug } = useParams()
  const blog = blogs.find((b) => b.slug === slug || b._id === slug) || blogs[0]

  return (
    <>
      <SEO title={blog.title} description={blog.excerpt} />
      <PageHero badge={blog.category} title={blog.title} subtitle={`By ${blog.author} · ${blog.readTime} min read`} />
      <section className="section-padding">
        <div className="container-wide max-w-3xl prose prose-lg">
          <p className="text-[var(--text-secondary)] leading-relaxed">{blog.content || blog.excerpt}</p>
          <Link to="/blogs" className="inline-block mt-8 text-acm-blue font-semibold">← Back to Blog</Link>
        </div>
      </section>
    </>
  )
}
