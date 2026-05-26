import { useApp } from '../context/AppContext'
import { SubPage } from './SubPage'

export function SecurityView() {
  const { user, setView } = useApp()
  if (!user) return null

  const logs = [
    { action: 'Account login', time: new Date().toLocaleString(), ip: '192.168.*.*' },
    {
      action: 'Session active',
      time: new Date(Date.now() - 3600000).toLocaleString(),
      ip: 'Mobile · Secure',
    },
    ...(user.transactions.slice(0, 3).map((t) => ({
      action: `${t.type} — ${t.note}`,
      time: new Date(t.timestamp).toLocaleString(),
      ip: 'Verified',
    })) ?? []),
  ]

  return (
    <SubPage title="Security Logs" onBack={() => setView('me')}>
      <div className="space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 border border-white/10">
            <p className="text-sm font-medium text-white">{log.action}</p>
            <p className="text-xs text-slate-500 mt-1">{log.time}</p>
            <p className="text-xs text-blue-400/80 mt-0.5">{log.ip}</p>
          </div>
        ))}
      </div>
    </SubPage>
  )
}
