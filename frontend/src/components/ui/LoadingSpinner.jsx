import { motion } from 'framer-motion'

export default function LoadingSpinner({ fullScreen = false }) {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-10 h-10 border-4 border-acm-blue/20 border-t-acm-blue rounded-full"
    />
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        {spinner}
      </div>
    )
  }
  return <div className="flex justify-center py-12">{spinner}</div>
}
