import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import { demoLogin } from '../../services/api'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Video Gallery' },
  { to: '/team', label: 'Team' },
  { to: '/projects', label: 'Projects' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/live', label: 'Live' },
  { to: '/blogs', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleDemoLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await demoLogin()
      localStorage.setItem('acm_token', response.token)
      localStorage.setItem('acm_user', JSON.stringify(response.user))
      toast.success('Logged in as Demo Admin!')
      navigate('/admin')
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      toast.error('Failed to login as Demo Admin')
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('acm_token')
    setIsLoggedIn(!!token)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    
    // Check auth status initially and setup listeners
    checkAuth()
    window.addEventListener('storage', checkAuth)
    
    // Set a polling check for instant update when log-in/log-out happens
    const interval = setInterval(checkAuth, 1000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('storage', checkAuth)
      clearInterval(interval)
    }
  }, [])

  // Statically use core content links for the main navigation menu
  const links = navLinks

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container-wide flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/images/logo.png" alt="ACM NMIMS Indore" className="w-10 h-10 rounded-full" />
          <div className="hidden sm:block">
            <p className={cn('font-bold text-sm leading-tight', scrolled ? 'text-[var(--text-primary)]' : 'text-white')}>
              ACM NMIMS Indore
            </p>
            <p className={cn('text-xs', scrolled ? 'text-[var(--text-secondary)]' : 'text-blue-100')}>
              Student Chapter
            </p>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'text-acm-blue bg-acm-blue/10'
                    : scrolled
                      ? 'text-[var(--text-secondary)] hover:text-acm-blue'
                      : 'text-white/90 hover:text-white'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn(
              'p-2 rounded-lg transition-colors',
              scrolled ? 'hover:bg-acm-blue/10 text-[var(--text-primary)]' : 'hover:bg-white/10 text-white'
            )}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {isLoggedIn ? (
            <Link
              to="/admin"
              className="hidden md:inline-flex px-5 py-2 bg-acm-blue hover:bg-acm-blue-dark text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-acm-blue/20"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/membership?mode=signup"
              className="hidden md:inline-flex px-4 py-2 bg-acm-blue hover:bg-acm-blue-dark text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-acm-blue/20"
            >
              Join ACM
            </Link>
          )}
          <button
            className="xl:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? (
              <X className={cn('w-6 h-6', scrolled ? 'text-[var(--text-primary)]' : 'text-white')} />
            ) : (
              <Menu className={cn('w-6 h-6', scrolled ? 'text-[var(--text-primary)]' : 'text-white')} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden glass border-t border-[var(--border-color)]"
          >
            <nav className="flex flex-col p-4 gap-1">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn('px-4 py-3 rounded-lg font-medium', isActive ? 'bg-acm-blue/10 text-acm-blue' : 'text-[var(--text-primary)]')
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="border-t border-[var(--border-color)] my-2 pt-2 flex flex-col gap-2">
                {isLoggedIn ? (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="w-full text-center px-4 py-2.5 bg-acm-blue text-white text-sm font-semibold rounded-xl hover:bg-acm-blue-dark transition-colors shadow-md"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/membership?mode=signup"
                    onClick={() => setOpen(false)}
                    className="w-full text-center px-4 py-2.5 bg-acm-blue text-white text-sm font-semibold rounded-xl hover:bg-acm-blue-dark transition-colors shadow-md"
                  >
                    Join ACM
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
