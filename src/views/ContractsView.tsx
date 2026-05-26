import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { LiveBalance } from '../components/LiveBalance'
import { useApp } from '../context/AppContext'
import { formatCountdown } from '../lib/contracts'
import { getTierById, VIP_TIERS } from '../data/vipTiers'
import { formatUsdt } from '../utils/format'

export function ContractsView() {
  const { user, buyVip, tick } = useApp()
  const [msg, setMsg] = useState('')
  const [, setNow] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setNow((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])

  void tick
  void setNow

  const handleBuy = (tierId: number) => {
    const r = buyVip(tierId)
    if (!r.success) alert(r.message)
    setMsg(r.message)
    setTimeout(() => setMsg(''), 4000)
  }

  const contracts = user?.contracts ?? []

  return (
    <div className="px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Contracts</h1>
        <p className="text-sm text-slate-400 mt-1">Active VIP plans · live earnings</p>
        <div className="mt-4">
          <LiveBalance />
        </div>
      </div>

      {msg && (
        <div className="mb-4 rounded-xl glass-panel px-4 py-3 text-sm text-emerald-400 border border-emerald-500/30">
          {msg}
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center border border-white/10 mb-8">
          <p className="text-slate-400">No active contracts yet.</p>
          <p className="text-sm text-slate-500 mt-2">Purchase a VIP plan below to start earning.</p>
        </div>
      ) : (
        <div className="space-y-5 mb-8">
          {contracts.map((c) => (
            <ContractCard key={c.id} contract={c} />
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Purchase VIP
      </h2>
      <div className="space-y-3">
        {VIP_TIERS.map((tier) => (
          <div
            key={tier.id}
            className="glass-panel rounded-xl p-4 flex items-center justify-between border border-white/10"
          >
            <div>
              <p className="font-semibold text-white">
                {tier.name} — {tier.label}
              </p>
              <p className="text-xs text-slate-500">${formatUsdt(tier.price)} · 60d ${formatUsdt(tier.projected60Day)}</p>
            </div>
            <Button size="sm" onClick={() => handleBuy(tier.id)}>
              Buy
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContractCard({
  contract,
}: {
  contract: import('../types').VipContract
}) {
  const { tick } = useApp()
  const tier = getTierById(contract.tierId)
  if (!tier) return null

  void tick
  const countdown = formatCountdown(contract.cycleEndsAt)

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 glow-card">
      <div className={`bg-gradient-to-r ${tier.headerGradient} px-5 py-4`}>
        <p className="text-sm font-medium text-black/70 uppercase tracking-wider">Active Contract</p>
        <h3 className="text-xl font-bold text-black/90">
          {tier.name} — {tier.label}
        </h3>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Activated</span>
          <span className="text-white">
            {new Date(contract.activatedAt).toLocaleString()}
          </span>
        </div>
        <div className="rounded-xl bg-black/30 px-4 py-3 border border-white/5">
          <p className="text-[10px] uppercase text-slate-500">Current cycle ends in</p>
          <p className="text-2xl font-mono font-bold text-white tabular-nums">{countdown}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-slate-500">Accumulated this cycle</p>
          <p className="text-xl font-bold profit-glow tabular-nums">
            +${contract.cycleAccumulated.toFixed(6)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <EarningStat label="1-HOUR" value={tier.hourlyIncome} />
          <EarningStat label="24-HOUR" value={tier.dailyIncome} />
          <EarningStat label="60-DAY" value={tier.projected60Day} />
        </div>
      </div>
    </div>
  )
}

function EarningStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/5 py-2 px-1 border border-white/5">
      <p className="text-[9px] text-slate-500 uppercase">{label}</p>
      <p className="font-bold text-white tabular-nums mt-0.5">${formatUsdt(value)}</p>
    </div>
  )
}
