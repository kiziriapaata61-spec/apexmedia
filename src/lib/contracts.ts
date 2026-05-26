import { CYCLE_MS, createContract, getPerSecondRate } from '../data/vipTiers'
import type { User } from '../types'

export function migrateUserContracts(user: User): User {
  if (user.contracts?.length) return user
  if (user.vipLevel > 0) {
    return { ...user, contracts: [createContract(user.vipLevel)] }
  }
  return { ...user, contracts: [] }
}

export function tickContractsOneSecond(user: User): User {
  if (!user.contracts.length) return user

  const now = Date.now()
  let balanceDelta = 0

  const contracts = user.contracts.map((c) => {
    let cycleEnds = new Date(c.cycleEndsAt).getTime()
    let cycleAccumulated = c.cycleAccumulated
    let totalAccumulated = c.totalAccumulated
    const perSec = getPerSecondRate(c.tierId)

    if (now >= cycleEnds) {
      cycleAccumulated = 0
      cycleEnds = now + CYCLE_MS
    }

    cycleAccumulated += perSec
    totalAccumulated += perSec
    balanceDelta += perSec

    return {
      ...c,
      cycleAccumulated,
      totalAccumulated,
      cycleEndsAt: new Date(cycleEnds).toISOString(),
      lastTickAt: new Date(now).toISOString(),
    }
  })

  return {
    ...user,
    contracts,
    balance: user.balance + balanceDelta,
    vipLevel: Math.max(user.vipLevel, ...contracts.map((x) => x.tierId)),
  }
}

export function formatCountdown(cycleEndsAt: string, now = Date.now()): string {
  const diff = Math.max(0, new Date(cycleEndsAt).getTime() - now)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export { createContract }
