import { cn } from '../../lib/utils'

export default function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 shadow-lg transition-all duration-300',
        hover && 'hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
