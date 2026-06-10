import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function PageHero({ title, subtitle, badge, image, children, className }) {
  return (
    <section className={cn('relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-acm-blue via-acm-blue-light to-acm-blue-dark opacity-95" />
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          {badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
              {badge}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          {subtitle && <p className="text-lg md:text-xl text-blue-100 max-w-2xl">{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
