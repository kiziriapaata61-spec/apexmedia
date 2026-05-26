import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants = {
    primary:
      'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:brightness-110 glow-blue active:scale-[0.98]',
    secondary:
      'bg-slate-800/80 text-slate-100 border border-slate-600/50 hover:border-blue-500/50 hover:bg-slate-800',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/50',
    outline:
      'border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
