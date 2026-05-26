export type ViewId =
  | 'login'
  | 'dashboard'
  | 'contracts'
  | 'referrals'
  | 'wallet'
  | 'me'
  | 'settings'
  | 'security'
  | 'transactions'
  | 'transfers'
  | 'admin'

export type AuthMode = 'login' | 'register'

export type TransactionType =
  | 'deposit'
  | 'withdraw'
  | 'vip_purchase'
  | 'earnings'
  | 'bonus'
  | 'transfer'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  note: string
  timestamp: string
}

export interface VipContract {
  id: string
  tierId: number
  activatedAt: string
  cycleEndsAt: string
  cycleAccumulated: number
  totalAccumulated: number
  lastTickAt: string
}

export interface VipTier {
  id: number
  name: string
  label: string
  price: number
  hourlyIncome: number
  dailyIncome: number
  projected60Day: number
  headerGradient: string
}

export interface User {
  username: string
  email: string
  phone: string
  password: string
  balance: number
  vipLevel: number
  totalDeposited: number
  totalWithdrawn: number
  referralCount: number
  referralCode: string
  referredBy: string | null
  withdrawalAddress: string
  transactions: Transaction[]
  contracts: VipContract[]
}

export interface GlobalState {
  balance: number
  vipLevel: number
  totalDeposited: number
  totalWithdrawn: number
  referralCount: number
}

export const ADMIN_EMAIL = 'admin0@gmail.com'
export const MIN_WITHDRAWAL = 15
