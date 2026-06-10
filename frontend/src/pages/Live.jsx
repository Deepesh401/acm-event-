import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, Clock, Users } from 'lucide-react'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import GlassCard from '../components/ui/GlassCard'
import { events } from '../data/staticData'
import api from '../services/api'

function Countdown({ targetDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTime({ days: 0, hours: 0, mins: 0, secs: 0 })
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.entries(time).map(([k, v]) => (
        <div key={k} className="text-center p-4 rounded-xl bg-white/10">
          <p className="text-3xl font-black text-white">{String(v).padStart(2, '0')}</p>
          <p className="text-xs text-blue-200 uppercase">{k}</p>
        </div>
      ))}
    </div>
  )
}

export default function Live() {
  const [liveData, setLiveData] = useState({ announcements: [], upcomingEvents: events.filter((e) => e.status === 'upcoming') })

  useEffect(() => {
    api.get('/live').then((r) => setLiveData(r.data.data || r.data)).catch(() => {})
  }, [])

  const nextEvent = liveData.upcomingEvents?.[0] || events.find((e) => e.status === 'upcoming')

  return (
    <>
      <SEO title="Live Event Tracking" description="Real-time ACM event updates and countdown." />
      <PageHero badge="Live" title="Live Event Tracking" subtitle="Real-time announcements and event status." />

      <section className="section-padding">
        <div className="container-wide grid lg:grid-cols-2 gap-8">
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-xl font-bold">Live Announcements</h3>
            </div>
            <div className="space-y-3">
              {(liveData.announcements?.length ? liveData.announcements : [{ title: 'Event Registration Open', message: 'Register now for upcoming chapter events.' }]).map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-acm-blue/5 border border-acm-blue/10"
                >
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{a.message}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {nextEvent && (
            <div className="bg-gradient-to-br from-acm-blue to-acm-blue-dark rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="text-xl font-bold">Next Event Countdown</h3>
              </div>
              <p className="text-blue-100 mb-6">{nextEvent.title}</p>
              <Countdown targetDate={nextEvent.date} />
              {nextEvent.registrationCount !== undefined && (
                <div className="flex items-center gap-2 mt-6 text-blue-100">
                  <Users className="w-4 h-4" />
                  {nextEvent.registrationCount} registered
                  {nextEvent.registrationLimit && ` / ${nextEvent.registrationLimit}`}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
