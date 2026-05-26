import { useApp } from '../context/AppContext'
import type { ViewId } from '../types'

const MAIN_NAV: { id: ViewId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◉' },
  { id: 'contracts', label: 'Contracts', icon: '★' },
  { id: 'referrals', label: 'Referral', icon: '◎' },
  { id: 'wallet', label: 'Wallet', icon: '₮' },
  { id: 'me', label: 'Me', icon: '👤' },
]

const ME_SUBVIEWS: ViewId[] = ['settings', 'security', 'transactions', 'transfers']

export function Navigation() {
  const { currentView, setView, global, isAdmin } = useApp()

  if (ME_SUBVIEWS.includes(currentView)) return null

  const navItems = isAdmin
    ? [...MAIN_NAV, { id: 'admin' as ViewId, label: 'Admin', icon: '⚙' }]
    : MAIN_NAV

  return (
    <>
      <header className="sticky top-0 z-50 hidden border-b glass-nav md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <BrandButton onClick={() => setView('dashboard')} />
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                active={currentView === item.id}
                label={item.label}
                onClick={() => setView(item.id)}
              />
            ))}
          </nav>
          <p className="text-sm font-bold text-emerald-400 tabular-nums">
            {global.balance.toFixed(2)} USDT
          </p>
        </div>
      </header>

      <header className="sticky top-0 z-50 glass-nav border-b md:hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          <BrandButton compact onClick={() => setView('dashboard')} />
          <p className="text-xs font-bold text-emerald-400 tabular-nums">
            {global.balance.toFixed(2)} USDT
          </p>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t pb-[env(safe-area-inset-bottom)] md:hidden">
        <div
          className={`grid gap-0.5 px-1 py-1.5 ${navItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'}`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center rounded-xl py-2 cursor-pointer ${
                currentView === item.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-[8px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

function BrandButton({ onClick, compact }: { onClick: () => void; compact?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 cursor-pointer">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] glow-blue">
        <span className="text-sm font-black text-white">A</span>
      </div>
      {!compact && <span className="text-sm font-bold text-white">Apex Media</span>}
    </button>
  )
}

function NavButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium cursor-pointer ${
        active ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'text-slate-400'
      }`}
    >
      {label}
    </button>
  )
}
