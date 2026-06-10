import { motion } from 'framer-motion'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'
import { FacultySection } from '../components/home/ChapterSections'
import { coreValues, timeline, chapterInfo } from '../data/staticData'

export default function About() {
  return (
    <>
      <SEO title="About" description="About ACM Global and NMIMS Indore ACM Student Chapter." />
      <PageHero
        badge="About Us"
        title="About ACM & Our Chapter"
        subtitle="Advancing computing as a science and profession since 1947."
        image="/images/hero-summit.png"
      />

      <section className="section-padding">
        <div className="container-wide grid lg:grid-cols-2 gap-6 sm:gap-10">
          <GlassCard>
            <h2 className="text-xl sm:text-2xl font-bold text-acm-blue mb-4">About ACM Global</h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-4">
              The Association for Computing Machinery (ACM) is the world&apos;s largest educational and scientific computing society. ACM delivers resources that advance computing as a science and profession.
            </p>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              With nearly 100,000 members worldwide, ACM provides the computing field&apos;s premier Digital Library and serves its members and the profession with publications, conferences, and career resources.
            </p>
          </GlassCard>
          <GlassCard>
            <h2 className="text-xl sm:text-2xl font-bold text-acm-blue mb-4">About Our Chapter</h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-4">
              {chapterInfo.name} was established to create a vibrant community of computing enthusiasts at NMIMS Indore. We organize workshops, hackathons, and networking events.
            </p>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed italic">
              &ldquo;{chapterInfo.theme}&rdquo;
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="section-padding bg-[var(--bg-secondary)]">
        <div className="container-wide">
          <SectionHeader label="Values" title="Core Values" subtitle="The pillars that define our chapter culture." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {coreValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${v.color} mb-4`} />
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{v.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FacultySection />

      <section className="section-padding bg-[var(--bg-secondary)]">
        <div className="container-wide">
          <SectionHeader label="Journey" title="Chapter Timeline" />
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-acm-blue/20 md:-translate-x-px" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex items-center gap-6 mb-8 sm:mb-10"
              >
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-acm-blue border-4 border-[var(--bg-secondary)] md:-translate-x-1/2 z-10" />
                <div className="ml-12 md:ml-0 md:w-full md:max-w-md md:mx-auto md:px-8">
                  <GlassCard>
                    <span className="text-acm-blue font-bold text-lg">{item.year}</span>
                    <h3 className="font-bold text-lg sm:text-xl mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
