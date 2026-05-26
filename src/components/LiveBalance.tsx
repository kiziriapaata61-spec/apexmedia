import { useGlobalState } from '../context/AppContext'

export function LiveBalance({ large = false }: { large?: boolean }) {
  const { balance } = useGlobalState()

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-400">Live Balance</p>
      <p
        className={`font-bold tabular-nums text-emerald-400 ${
          large ? 'text-3xl sm:text-4xl' : 'text-xl'
        }`}
      >
        {balance.toFixed(2)} USDT
      </p>
    </div>
  )
}
