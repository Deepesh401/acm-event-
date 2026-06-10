import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function CountUp({ end, suffix = '', duration = 2000 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    let frame
    const startTime = performance.now()

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * end))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [inView, end, duration])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="tabular-nums inline-block"
    >
      {display}{suffix}
    </motion.span>
  )
}
