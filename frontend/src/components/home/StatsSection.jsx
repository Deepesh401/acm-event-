import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import GlassCard from '../ui/GlassCard'
import { CountUp } from '../ui/AnimatedCounter'
import { statistics } from '../../data/staticData'
import { useFetch } from '../../hooks/useFetch'

export default function StatsSection() {
  const { data } = useFetch('statistics', {}, statistics)

  return (
    <section className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-wide">
        <SectionHeader
          label="Impact"
          title="Our Chapter in Numbers"
          subtitle="Two years of relentless innovation, community building, and academic excellence."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {data.map((stat, i) => (
            <motion.div
              key={stat.key || stat._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="text-center py-8">
                <p className="text-4xl md:text-5xl font-black text-acm-blue mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix || ''} />
                </p>
                <p className="text-[var(--text-secondary)] font-medium">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
