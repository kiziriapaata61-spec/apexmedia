import { useState } from 'react'
import { Button } from '../components/Button'
import { GlowCard } from '../components/GlowCard'
import { LiveBalance } from '../components/LiveBalance'
import { PageShell } from '../components/PageShell'
import { useApp } from '../context/AppContext'
import { DEPOSIT_ADDRESSES } from '../data/vipTiers'

export function WalletView() {
  const { global, submitDepositTxid, submitWithdrawal, user } = useApp()
  const [txid, setTxid] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState<'trc' | 'bep' | null>(null)

  const copy = async (text: string, key: 'trc' | 'bep') => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = submitDepositTxid(txid, parseFloat(depositAmount))
    setMessage(result.message)
    if (result.success) {
      setTxid('')
      setDepositAmount('')
    }
  }

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    const result = submitWithdrawal(parseFloat(withdrawAmount))
    setMessage(result.message)
    if (result.success) setWithdrawAmount('')
  }

  const inTx = user?.transactions.filter((t) => t.type === 'deposit' || (t.amount > 0 && t.type === 'bonus')) ?? []
  const outTx = user?.transactions.filter((t) => t.type === 'withdraw' || t.type === 'vip_purchase' || t.amount < 0) ?? []

  return (
    <PageShell title="Wallet" subtitle="Deposit, withdraw, and view transaction totals.">
      <div className="mb-6 flex flex-wrap gap-6 items-end justify-between">
        <LiveBalance />
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-[10px] uppercase text-slate-500">Total In</p>
            <p className="text-xl font-bold text-blue-400 tabular-nums">{global.totalDeposited.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500">Total Out</p>
            <p className="text-xl font-bold text-red-400 tabular-nums">{global.totalWithdrawn.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard highlight className="p-5 sm:p-6 space-y-5">
          <h2 className="font-bold text-white">Deposit (USDT)</h2>
          <AddressBlock
            label="TRC-20"
            address={DEPOSIT_ADDRESSES.trc20}
            onCopy={() => copy(DEPOSIT_ADDRESSES.trc20, 'trc')}
            copied={copied === 'trc'}
          />
          <AddressBlock
            label="BEP-20"
            address={DEPOSIT_ADDRESSES.bep20}
            onCopy={() => copy(DEPOSIT_ADDRESSES.bep20, 'bep')}
            copied={copied === 'bep'}
          />
          <form onSubmit={handleDeposit} className="space-y-3 pt-3 border-t border-slate-700/50">
            <Input label="Deposit Amount (USDT)" value={depositAmount} onChange={setDepositAmount} type="number" />
            <Input label="Transaction TXID" value={txid} onChange={setTxid} mono />
            <Button type="submit" fullWidth>Submit TXID</Button>
          </form>
        </GlowCard>

        <GlowCard className="p-5 sm:p-6">
          <h2 className="font-bold text-white mb-2">Withdraw</h2>
          <p className="text-xs text-amber-400/90 mb-4">Minimum withdrawal: $15 | VIP 1 required</p>
          {user?.withdrawalAddress ? (
            <p className="text-xs text-slate-500 mb-3 font-mono truncate">
              To: {user.withdrawalAddress}
            </p>
          ) : (
            <p className="text-xs text-red-400 mb-3">Set withdrawal address in Me first.</p>
          )}
          <form onSubmit={handleWithdraw} className="space-y-3">
            <Input label="Amount (USDT)" value={withdrawAmount} onChange={setWithdrawAmount} type="number" />
            <Button type="submit" fullWidth variant="secondary">Submit Withdrawal</Button>
          </form>
        </GlowCard>
      </div>

      <div className="grid gap-5 mt-6 lg:grid-cols-2">
        <TransactionList title="Recent In" items={inTx.slice(0, 8)} positive />
        <TransactionList title="Recent Out" items={outTx.slice(0, 8)} />
      </div>
    </PageShell>
  )
}

function AddressBlock({
  label,
  address,
  onCopy,
  copied,
}: {
  label: string
  address: string
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <code className="block break-all rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-blue-300 font-mono">
        {address}
      </code>
      <Button size="sm" variant="ghost" className="mt-2" onClick={onCopy}>
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  mono,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  mono?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-white text-sm focus:border-blue-500/60 ${mono ? 'font-mono' : ''}`}
      />
    </div>
  )
}

function TransactionList({
  title,
  items,
  positive,
}: {
  title: string
  items: { id: string; amount: number; note: string; timestamp: string }[]
  positive?: boolean
}) {
  return (
    <GlowCard className="p-5">
      <h3 className="font-semibold text-white mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No transactions yet.</p>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((t) => (
            <li
              key={t.id}
              className="flex justify-between text-xs border-b border-slate-800 pb-2"
            >
              <span className="text-slate-400 truncate max-w-[60%]">{t.note}</span>
              <span className={`font-mono tabular-nums ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {positive ? '+' : ''}{Math.abs(t.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </GlowCard>
  )
}
