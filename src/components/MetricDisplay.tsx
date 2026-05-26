import { formatUsdtLabel } from '../utils/format'

interface MetricDisplayProps {
  label: string
  value: number
  suffix?: string
  highlight?: boolean
  large?: boolean
}

export function MetricDisplay({
  label,
  value,
  suffix = 'USDT',
  highlight = false,
  large = false,
}: MetricDisplayProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span
        className={`font-bold tabular-nums ${
          large ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
        } ${highlight ? 'gradient-text' : 'text-white'}`}
      >
        {formatUsdtLabel(value, suffix)}
      </span>
    </div>
  )
}
