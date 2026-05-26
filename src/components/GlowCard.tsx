import type { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  highlight?: boolean
  glass?: boolean
}

export function GlowCard({
  children,
  className = '',
  highlight = false,
  glass = true,
}: GlowCardProps) {
  return (
    <div
      className={`glow-card rounded-2xl border ${
        glass
          ? 'glass-panel border-slate-600/40'
          : 'border-slate-700/60 bg-[#0f172a]/90'
      } ${highlight ? 'glow-blue ring-1 ring-blue-500/40' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
