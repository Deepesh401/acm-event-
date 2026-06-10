import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import { chapterInfo } from '../../data/staticData'

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('acm_token'))
  }, [])
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-acm-blue-dark via-acm-blue to-acm-blue-light" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: 'url(/images/hero-summit.png)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

      {/* Animated orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5 blur-3xl"
          style={{ width: 300 + i * 100, height: 300 + i * 100 }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          initial={{
            top: `${20 + i * 20}%`,
            left: `${10 + i * 25}%`,
          }}
        />
      ))}

      <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-acm-gold" />
            ACM Student Chapter
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6"
          >
            Preserving Legacy.
            <br />
            <span className="text-blue-200">Showcasing Innovation.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 mb-4 font-light italic"
          >
            {chapterInfo.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-blue-100/80 mb-10 max-w-2xl"
          >
            NMIMS Indore ACM Student Chapter — empowering the next generation of computing professionals through innovation, community, and excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            {isLoggedIn ? (
              <Link to="/admin">
                <Button className="bg-white text-acm-blue hover:bg-blue-50">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/membership">
                <Button className="bg-white text-acm-blue hover:bg-blue-50">
                  Join ACM <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <Link to="/about">
              <Button variant="secondary" className="text-white border-white/30 hover:bg-white/10">
                Explore Chapter
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
