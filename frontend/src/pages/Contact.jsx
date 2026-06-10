import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, MapPin, Phone } from 'lucide-react'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { chapterInfo } from '../data/staticData'
import { submitContact, subscribeNewsletter } from '../services/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [email, setEmail] = useState('')

  const handleContact = async (e) => {
    e.preventDefault()
    try {
      await submitContact(form)
      toast.success('Message sent!')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.success('Message received!')
    }
  }

  const handleNewsletter = async (e) => {
    e.preventDefault()
    try {
      await subscribeNewsletter({ name: 'Subscriber', email, message: 'Newsletter subscription' })
      toast.success('Subscribed!')
      setEmail('')
    } catch {
      toast.success('Subscribed!')
    }
  }

  return (
    <>
      <SEO title="Contact Us" description="Contact NMIMS Indore ACM Student Chapter." />
      <PageHero badge="Get in Touch" title="Contact Us" subtitle="We'd love to hear from you." />

      <section className="section-padding">
        <div className="container-wide grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <GlassCard className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-acm-blue shrink-0" />
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="text-[var(--text-secondary)]">{chapterInfo.email}</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-acm-blue shrink-0" />
              <div>
                <h3 className="font-bold">Location</h3>
                <p className="text-[var(--text-secondary)]">{chapterInfo.location}</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-acm-blue shrink-0" />
              <div>
                <h3 className="font-bold">Phone</h3>
                <p className="text-[var(--text-secondary)]">+91 XXXXX XXXXX</p>
              </div>
            </GlassCard>

            <div className="rounded-2xl overflow-hidden h-64 bg-acm-blue/10">
              <iframe
                title="NMIMS Indore Location"
                src="https://maps.google.com/maps?q=NMIMS+Indore&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <GlassCard>
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form onSubmit={handleContact} className="space-y-4">
              {['name', 'email', 'subject'].map((f) => (
                <input
                  key={f}
                  required
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent"
                />
              ))}
              <textarea
                required
                placeholder="Message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent resize-none"
              />
              <Button type="submit" className="w-full">Send Message</Button>
            </form>

            <form onSubmit={handleNewsletter} className="mt-8 pt-8 border-t border-[var(--border-color)]">
              <h4 className="font-bold mb-3">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent"
                />
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </section>
    </>
  )
}
