import { useState } from 'react'
import { Button } from '../components/Button'
import { GlowCard } from '../components/GlowCard'
import { PageShell } from '../components/PageShell'
import { useApp } from '../context/AppContext'

export function AdminView() {
  const { allUsers, adminUpdateUser, isAdmin } = useApp()
  const [selected, setSelected] = useState(allUsers[0]?.username ?? '')
  const [balance, setBalance] = useState('')
  const [vipLevel, setVipLevel] = useState('')
  const [referralCount, setReferralCount] = useState('')

  if (!isAdmin) {
    return (
      <PageShell title="Access Denied">
        <p className="text-red-400">Admin access requires admin0@gmail.com</p>
      </PageShell>
    )
  }

  const target = allUsers.find((u) => u.username === selected)

  const apply = () => {
    if (!selected) return
    adminUpdateUser(selected, {
      ...(balance !== '' ? { balance: parseFloat(balance) } : {}),
      ...(vipLevel !== '' ? { vipLevel: parseInt(vipLevel, 10) } : {}),
      ...(referralCount !== '' ? { referralCount: parseInt(referralCount, 10) } : {}),
    })
    setBalance('')
    setVipLevel('')
    setReferralCount('')
  }

  return (
    <PageShell title="Admin Panel" subtitle="Manage all user accounts.">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard className="p-5">
          <h2 className="font-bold text-white mb-4">All Users ({allUsers.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allUsers.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => setSelected(u.username)}
                className={`w-full text-left rounded-xl px-4 py-3 border cursor-pointer transition-colors ${
                  selected === u.username
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-slate-700/50 hover:bg-slate-800/50'
                }`}
              >
                <p className="font-medium text-white">{u.username}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
                <p className="text-xs text-emerald-400 mt-1">
                  ${u.balance.toFixed(2)} · VIP{u.vipLevel} · Refs: {u.referralCount}
                </p>
              </button>
            ))}
          </div>
        </GlowCard>

        <GlowCard highlight className="p-5 space-y-4">
          <h2 className="font-bold text-white">Edit: {selected}</h2>
          {target && (
            <div className="text-sm text-slate-400 space-y-1 mb-4">
              <p>Balance: {target.balance.toFixed(2)}</p>
              <p>VIP: {target.vipLevel}</p>
              <p>Referrals: {target.referralCount}</p>
              <p>Code: {target.referralCode}</p>
            </div>
          )}
          <AdminField label="New Balance" value={balance} onChange={setBalance} />
          <AdminField label="VIP Level (0-5)" value={vipLevel} onChange={setVipLevel} />
          <AdminField label="Referral Count" value={referralCount} onChange={setReferralCount} />
          <Button fullWidth onClick={apply}>Apply Changes</Button>
        </GlowCard>
      </div>
    </PageShell>
  )
}

function AdminField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white"
      />
    </div>
  )
}
