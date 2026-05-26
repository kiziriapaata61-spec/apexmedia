import type { ReactNode } from 'react'

export function SubPage({
  title,
  onBack,
  children,
}: {
  title: string
  onBack: () => void
  children: ReactNode
}) {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button type="button" onClick={onBack} className="text-blue-400 text-sm mb-4 cursor-pointer">
        ← Back to Me
      </button>
      <h1 className="text-xl font-bold text-white mb-6">{title}</h1>
      {children}
    </div>
  )
}
