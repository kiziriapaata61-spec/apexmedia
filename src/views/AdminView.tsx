import { useState, useEffect } from 'react'
import { Button } from '../components/Button'
import { GlowCard } from '../components/GlowCard'
import { PageShell } from '../components/PageShell'
import { supabase } from '../lib/supabaseClient'

export function AdminView() {
  const [users, setUsers] = useState<any[]>([])
  const [selected, setSelected] = useState('')
  const [balance, setBalance] = useState('')
  const [vipLevel, setVipLevel] = useState('')
  const [referralCount, setReferralCount] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('*')
      if (data) {
        setUsers(data)
        if (data.length > 0) setSelected(data[0].username)
      }
    }
    fetchUsers()
  }, [])

  const apply = async () => {
    if (!selected) return
    const updates: any = {}
    if (balance !== '') updates.balance = parseFloat(balance)
    if (vipLevel !== '') updates.vip_level = parseInt(vipLevel, 10)
    if (referralCount !== '') updates.referral_count = parseInt(referralCount, 10)
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('username', selected)
    if (error) {
      alert("Error: " + error.message)
    } else {
      alert("Changes applied successfully!")
      window.location.reload()
    }
  }

  return (
    <PageShell title="Admin Panel" subtitle="Manage all user accounts via Supabase.">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard className="p-5">
          <h2 className="font-bold text-white mb-4">All Users ({users.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((u) => (
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
                  ${(u.balance || 0).toFixed(2)} · VIP{u.vip_level || 0} · Refs: {u.referral_count || 0}
                </p>
              </button>
            ))}
          </div>
        </GlowCard>
        <GlowCard highlight className="p-5 space-y-4">
          <h2 className="font-bold text-white">Edit: {selected}</h2>
          <AdminField label="New Balance" value={balance} onChange={setBalance} />
          <AdminField label="VIP Level (0-5)" value={vipLevel} onChange={setVipLevel} />
          <AdminField label="Referral Count" value={referralCount} onChange={setReferralCount} />
          <Button fullWidth onClick={apply}>Apply Changes</Button>
        </GlowCard>
      </div>
    </PageShell>
  )
}

function AdminField({ label, value, onChange }: any) {
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
