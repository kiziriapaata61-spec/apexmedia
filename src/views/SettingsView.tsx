import { useState } from 'react'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'
import { SubPage } from './SubPage'

export function SettingsView() {
  const { user, setView, updateProfile } = useApp()
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')

  if (!user) return null

  return (
    <SubPage title="Account Settings" onBack={() => setView('me')}>
      <div className="space-y-4">
        <Field label="Username" value={user.username} readOnly />
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Phone" value={phone} onChange={setPhone} />
        <Button fullWidth onClick={() => { updateProfile({ email, phone }); setView('me') }}>
          Save Changes
        </Button>
      </div>
    </SubPage>
  )
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white read-only:opacity-60"
      />
    </div>
  )
}
