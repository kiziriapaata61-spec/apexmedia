import { useState } from 'react'
import { Button } from '../components/Button'
import { GlowCard } from '../components/GlowCard'
import { PageShell } from '../components/PageShell'
import { useApp } from '../context/AppContext'

export function ReferralsView() {
  const { user, global } = useApp()
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const copyCode = async () => {
    await navigator.clipboard.writeText(user.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageShell title="Referral" subtitle="Share your code — earn when invitees register.">
      <GlowCard highlight className="p-6 mb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Your Referral Code</p>
        <p className="text-3xl sm:text-4xl font-black gradient-text tracking-wider">
          {user.referralCode}
        </p>
        <Button className="mt-4" variant="secondary" onClick={copyCode}>
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </GlowCard>

      <div className="grid grid-cols-2 gap-4">
        <GlowCard className="p-6 text-center">
          <p className="text-4xl font-bold text-white">{global.referralCount}</p>
          <p className="text-xs text-slate-500 mt-2 uppercase">Total Invited Members</p>
        </GlowCard>
        <GlowCard className="p-6 text-center">
          <p className="text-sm text-slate-400">Referred by</p>
          <p className="text-lg font-semibold text-purple-300 mt-1">
            {user.referredBy ?? '—'}
          </p>
        </GlowCard>
      </div>
    </PageShell>
  )
}
