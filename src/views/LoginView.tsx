import { useState } from 'react'
import { Button } from '../components/Button'
import { GlowCard } from '../components/GlowCard'
import { useApp } from '../context/AppContext'

export function LoginView() {
  const { authMode, setAuthMode, login, register } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (authMode === 'login') {
      if (!login(username, password)) setError('Invalid username or password.')
    } else {
      if (!username || !password || !email) {
        setError('Username, password, and email are required.')
        return
      }
      const result = register({ username, password, email, phone, referralCode })
      if (!result.success) setError(result.error ?? 'Registration failed.')
    }
  }

  return (
    <div className="hero-mesh min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] glow-blue">
            <span className="text-2xl font-black text-white">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Apex Media</h1>
          <p className="text-sm text-slate-400 mt-1">Premium Digital Yield Platform</p>
        </div>

        <GlowCard highlight className="p-6 sm:p-8">
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-slate-900/80">
            {(['login', 'register'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => { setAuthMode(mode); setError('') }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize cursor-pointer ${
                  authMode === mode
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white'
                    : 'text-slate-400'
                }`}
              >
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Username" value={username} onChange={setUsername} />
            <Field label="Password" value={password} onChange={setPassword} type="password" />

            {authMode === 'register' && (
              <>
                <Field label="Email" value={email} onChange={setEmail} type="email" />
                <Field label="Phone" value={phone} onChange={setPhone} />
                <Field
                  label="Referral Code"
                  value={referralCode}
                  onChange={setReferralCode}
                  placeholder="e.g. gg55623k (optional)"
                />
                <p className="text-xs text-emerald-400/90">
                  New accounts receive 5 USDT welcome bonus.
                </p>
              </>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" fullWidth size="lg">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </GlowCard>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
        required={label === 'Username' || label === 'Password' || label === 'Email'}
      />
    </div>
  )
}
