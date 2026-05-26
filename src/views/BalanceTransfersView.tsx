import { useState } from 'react'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'
import { SubPage } from './SubPage'

export function BalanceTransfersView() {
  const { setView, global, internalTransfer } = useApp()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    const result = internalTransfer(parseFloat(amount), note)
    setMessage(result.message)
    if (result.success) {
      setAmount('')
      setNote('')
    }
  }

  return (
    <SubPage title="Balance Transfers" onBack={() => setView('me')}>
      <p className="text-sm text-slate-400 mb-4">
        Available: <span className="text-emerald-400 font-bold">{global.balance.toFixed(2)} USDT</span>
      </p>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Amount (USDT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Note</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white"
          />
        </div>
        {message && (
          <p className={`text-sm ${message.includes('Transferred') ? 'text-emerald-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        <Button type="submit" fullWidth>
          Confirm Transfer
        </Button>
      </form>
    </SubPage>
  )
}
