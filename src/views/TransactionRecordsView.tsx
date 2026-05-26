import { useApp } from '../context/AppContext'
import { SubPage } from './SubPage'

export function TransactionRecordsView() {
  const { user, setView } = useApp()
  if (!user) return null

  return (
    <SubPage title="Transaction Records" onBack={() => setView('me')}>
      {user.transactions.length === 0 ? (
        <p className="text-slate-500 text-sm">No transactions yet.</p>
      ) : (
        <div className="space-y-2">
          {user.transactions.map((t) => (
            <div
              key={t.id}
              className="glass-panel rounded-xl p-4 flex justify-between border border-white/10"
            >
              <div>
                <p className="text-sm text-white capitalize">{t.type.replace('_', ' ')}</p>
                <p className="text-xs text-slate-500">{t.note}</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  {new Date(t.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className={`font-mono font-bold tabular-nums ${
                  t.amount >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {t.amount >= 0 ? '+' : ''}
                {t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </SubPage>
  )
}
