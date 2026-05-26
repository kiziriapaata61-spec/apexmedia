import { GlowCard } from '../components/GlowCard'
import { LiveBalance } from '../components/LiveBalance'
import { useApp } from '../context/AppContext'
import { getTierById } from '../data/vipTiers'
import { formatUsdt } from '../utils/format'

export function DashboardView() {
  const { global, user, setView } = useApp()
  const activeContracts = user?.contracts.length ?? 0
  const topTier = user?.contracts.length
    ? Math.max(...user.contracts.map((c) => c.tierId))
    : 0
  const tier = getTierById(topTier)

  return (
    <div className="px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-slate-400 mb-6">Welcome, {user?.username}</p>

      <GlowCard highlight className="p-6 mb-5 border border-white/10">
        <LiveBalance large />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <MiniStat label="VIP Level" value={tier ? `${tier.name}` : 'None'} />
          <MiniStat label="Active Contracts" value={String(activeContracts)} />
          <MiniStat label="Total In" value={`$${formatUsdt(global.totalDeposited)}`} />
          <MiniStat label="Total Out" value={`$${formatUsdt(global.totalWithdrawn)}`} />
        </div>
      </GlowCard>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setView('contracts')}
          className="glass-panel rounded-2xl p-4 text-left border border-white/10 hover:border-blue-500/30 cursor-pointer"
        >
          <p className="text-sm font-semibold text-white">My Contracts</p>
          <p className="text-xs text-slate-500 mt-1">View live earnings</p>
        </button>
        <button
          type="button"
          onClick={() => setView('wallet')}
          className="glass-panel rounded-2xl p-4 text-left border border-white/10 hover:border-blue-500/30 cursor-pointer"
        >
          <p className="text-sm font-semibold text-white">Wallet</p>
          <p className="text-xs text-slate-500 mt-1">Deposit & withdraw</p>
        </button>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-slate-500">{label}</p>
      <p className="text-sm font-bold text-white mt-0.5">{value}</p>
    </div>
  )
}
