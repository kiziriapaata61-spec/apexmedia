import type { VipTier } from '../types'

export const VIP_TIERS: VipTier[] = [
  {
    id: 1,
    name: 'VIP 1',
    label: 'Silver',
    price: 25,
    hourlyIncome: 0.1,
    dailyIncome: 2.4,
    projected60Day: 144,
    headerGradient: 'from-slate-400 via-slate-300 to-slate-500',
  },
  {
    id: 2,
    name: 'VIP 2',
    label: 'Blue',
    price: 65,
    hourlyIncome: 0.25,
    dailyIncome: 6,
    projected60Day: 360,
    headerGradient: 'from-blue-600 via-blue-500 to-cyan-500',
  },
  {
    id: 3,
    name: 'VIP 3',
    label: 'Gold',
    price: 205,
    hourlyIncome: 0.51,
    dailyIncome: 12.3,
    projected60Day: 738,
    headerGradient: 'from-[#c8922a] via-[#e8b84b] to-[#f5d78e]',
  },
  {
    id: 4,
    name: 'VIP 4',
    label: 'Royal',
    price: 550,
    hourlyIncome: 1.2,
    dailyIncome: 28.8,
    projected60Day: 1728,
    headerGradient: 'from-purple-700 via-violet-600 to-purple-400',
  },
  {
    id: 5,
    name: 'VIP 5',
    label: 'Platinum',
    price: 885,
    hourlyIncome: 3,
    dailyIncome: 72,
    projected60Day: 4320,
    headerGradient: 'from-slate-300 via-indigo-200 to-cyan-200',
  },
]

export const DEPOSIT_ADDRESSES = {
  trc20: 'TXj4m5xrhPNKJr96dGH1hGetgtTsB9EFvu',
  bep20: '0x428D6a8c9cc5592D7C1FE522C29784E8156E0f02',
} as const

export const REGISTRATION_BONUS = 5
const CYCLE_MS = 24 * 60 * 60 * 1000

export function getTierById(level: number): VipTier | undefined {
  return VIP_TIERS.find((t) => t.id === level)
}

export function getPerSecondRate(tierId: number): number {
  const tier = getTierById(tierId)
  return tier ? tier.hourlyIncome / 3600 : 0
}

export function createContract(tierId: number): import('../types').VipContract {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    tierId,
    activatedAt: new Date(now).toISOString(),
    cycleEndsAt: new Date(now + CYCLE_MS).toISOString(),
    cycleAccumulated: 0,
    totalAccumulated: 0,
    lastTickAt: new Date(now).toISOString(),
  }
}

export function generateUniqueReferralCode(existing: string[]): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code: string
  do {
    code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  } while (existing.includes(code))
  return code
}

export { CYCLE_MS }
