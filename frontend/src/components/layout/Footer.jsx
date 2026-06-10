import { Link } from 'react-router-dom'
import { Code2, Share2, Camera, Mail, MapPin } from 'lucide-react'
import { chapterInfo } from '../../data/staticData'

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      <div className="container-wide section-padding !py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="ACM" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold">ACM NMIMS Indore</p>
                <p className="text-sm text-[var(--text-secondary)]">Student Chapter</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] italic mb-2">{chapterInfo.theme}</p>
            <p className="text-sm text-acm-blue font-medium">{chapterInfo.tagline}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              {['About', 'Events', 'Team', 'Projects', 'Membership'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="hover:text-acm-blue transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-acm-blue" />
                {chapterInfo.email}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-acm-blue mt-0.5 shrink-0" />
                {chapterInfo.location}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { Icon: Code2, href: chapterInfo.social.github },
                { Icon: Share2, href: chapterInfo.social.linkedin },
                { Icon: Camera, href: chapterInfo.social.instagram },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl glass hover:bg-acm-blue hover:text-white transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} NMIMS Indore ACM Student Chapter. All rights reserved.</p>
          <p>
            Built with ❤️ by <span className="text-acm-blue font-semibold">ACM NMIMS Indore</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
