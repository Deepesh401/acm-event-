import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-acm-blue hover:bg-acm-blue-dark text-white shadow-lg shadow-acm-blue/25',
  secondary: 'glass hover:bg-white/90 dark:hover:bg-white/10 text-[var(--text-primary)]',
  outline: 'border-2 border-acm-blue text-acm-blue hover:bg-acm-blue hover:text-white',
  ghost: 'hover:bg-acm-blue/10 text-acm-blue',
}

export default function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
