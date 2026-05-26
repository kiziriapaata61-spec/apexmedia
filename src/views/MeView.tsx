import { useState } from 'react'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { useApp } from '../context/AppContext'
import { formatUsdt } from '../utils/format'

const MENU = [
  { id: 'settings' as const, label: 'Account Settings', icon: '⚙️', desc: 'Profile & preferences' },
  { id: 'security' as const, label: 'Security Logs', icon: '🔒', desc: 'Login & activity history' },
  { id: 'transactions' as const, label: 'Transaction Records', icon: '📋', desc: 'Full in/out history' },
  { id: 'transfers' as const, label: 'Balance Transfers', icon: '↔️', desc: 'Internal transfers' },
]

export function MeView() {
  const { user, global, logout, setView, updateWithdrawalAddress } = useApp()
  const [copied, setCopied] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [draftAddress, setDraftAddress] = useState('')

  if (!user) return null

  const copyCode = async () => {
    await navigator.clipboard.writeText(user.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openAddressModal = () => {
    setDraftAddress(user.withdrawalAddress)
    setAddressModal(true)
  }

  const saveAddress = () => {
    updateWithdrawalAddress(draftAddress.trim())
    setAddressModal(false)
  }

  return (
    <div className="px-4 py-6 sm:px-6 max-w-lg mx-auto">
      <div className="glass-panel rounded-3xl p-6 mb-5 text-center border border-white/10">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white ring-4 ring-white/10">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-white">{user.username}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
        <p className="text-2xl font-bold text-emerald-400 mt-4 tabular-nums">
          {global.balance.toFixed(2)} <span className="text-sm text-slate-400">USDT</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Lifetime Deposits" value={`$${formatUsdt(global.totalDeposited)}`} accent="blue" />
        <StatCard label="Lifetime Withdrawals" value={`$${formatUsdt(global.totalWithdrawn)}`} accent="purple" />
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-5 border border-white/10">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Your Referral Code</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-xl bg-black/30 px-4 py-3 text-lg font-bold text-cyan-300 tracking-wider">
            {user.referralCode}
          </code>
          <Button size="sm" variant="secondary" onClick={copyCode}>
            {copied ? '✓' : 'Copy'}
          </Button>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Unique to your account · {global.referralCount} members invited
        </p>
      </div>

      <button
        type="button"
        onClick={openAddressModal}
        className="w-full glass-panel rounded-2xl p-4 mb-5 text-left border border-white/10 hover:border-blue-500/40 transition-colors cursor-pointer"
      >
        <p className="text-xs text-slate-400 uppercase tracking-wider">Withdrawal Address</p>
        <p className="text-sm text-white mt-1 font-mono truncate">
          {user.withdrawalAddress || 'Tap to set address'}
        </p>
        <p className="text-[11px] text-amber-400/90 mt-2">
          Minimum withdrawal: $15 | VIP 1 required
        </p>
      </button>

      <div className="space-y-2 mb-6">
        {MENU.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className="w-full glass-panel rounded-2xl px-4 py-3.5 flex items-center gap-4 border border-white/10 hover:border-blue-500/30 transition-colors cursor-pointer text-left"
          >
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{item.label}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <span className="text-slate-500">›</span>
          </button>
        ))}
      </div>

      <Button
        fullWidth
        variant="outline"
        size="lg"
        onClick={logout}
        className="border-red-500/40 text-red-400 hover:bg-red-500/10"
      >
        Log Out
      </Button>

      <Modal open={addressModal} onClose={() => setAddressModal(false)} title="Withdrawal Address">
        <p className="text-xs text-amber-400 mb-4">Minimum withdrawal: $15 | VIP 1 required</p>
        <textarea
          value={draftAddress}
          onChange={(e) => setDraftAddress(e.target.value)}
          rows={3}
          placeholder="TRC-20 or BEP-20 address"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white font-mono text-sm resize-none"
        />
        <Button fullWidth className="mt-4" onClick={saveAddress}>
          Save Address
        </Button>
      </Modal>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'blue' | 'purple'
}) {
  return (
    <div
      className={`glass-panel rounded-2xl p-4 border ${
        accent === 'blue' ? 'border-blue-500/20' : 'border-purple-500/20'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`text-lg font-bold mt-1 tabular-nums ${accent === 'blue' ? 'text-blue-300' : 'text-purple-300'}`}>
        {value}
      </p>
    </div>
  )
}
