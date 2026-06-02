import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createContract, getTierById } from '../data/vipTiers'
import { tickContractsOneSecond } from '../lib/contracts'
import {
  addTransaction,
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  saveUser,
} from '../lib/storage'
import { supabase } from '../lib/supabaseClient'
import type { AuthMode, GlobalState, User, ViewId } from '../types'
import { ADMIN_EMAIL, MIN_WITHDRAWAL } from '../types'

interface AppContextValue {
  user: User | null
  global: GlobalState
  isAuthenticated: boolean
  isAdmin: boolean
  currentView: ViewId
  authMode: AuthMode
  tick: number
  setView: (view: ViewId) => void
  setAuthMode: (mode: AuthMode) => void
  login: (username: string, password: string) => Promise<boolean>
  register: (data: {
    username: string
    password: string
    email: string
    phone: string
    referralCode?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  buyVip: (tierId: number) => { success: boolean; message: string }
  submitDepositTxid: (txid: string, amount: number) => { success: boolean; message: string }
  submitWithdrawal: (amount: number) => { success: boolean; message: string }
  updateWithdrawalAddress: (address: string) => void
  updateProfile: (patch: Partial<Pick<User, 'email' | 'phone'>>) => void
  internalTransfer: (amount: number, note: string) => { success: boolean; message: string }
  refreshUser: () => void
  allUsers: User[]
  adminUpdateUser: (
    username: string,
    patch: Partial<Pick<User, 'balance' | 'vipLevel' | 'referralCount'>>,
  ) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function toGlobal(user: User | null): GlobalState {
  if (!user) {
    return { balance: 0, vipLevel: 0, totalDeposited: 0, totalWithdrawn: 0, referralCount: 0 }
  }
  return {
    balance: user.balance,
    vipLevel: user.vipLevel,
    totalDeposited: user.totalDeposited,
    totalWithdrawn: user.totalWithdrawn,
    referralCount: user.referralCount,
  }
}

function hasVip1OrHigher(user: User): boolean {
  return user.contracts.some((c) => c.tierId >= 1) || user.vipLevel >= 1
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())
  const [currentView, setCurrentView] = useState<ViewId>(() =>
    getCurrentUser() ? 'dashboard' : 'login',
  )
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [allUsers, setAllUsers] = useState<User[]>(() => getAllUsers())
  const [tick, setTick] = useState(0)

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser())
    setAllUsers(getAllUsers())
  }, [])

  const persist = useCallback((updated: User) => {
    saveUser(updated)
    setUser(updated)
    setAllUsers(getAllUsers())
  }, [])

  const global = useMemo(() => toGlobal(user), [user])
  const isAdmin = user?.email === ADMIN_EMAIL

  useEffect(() => {
    const syncFromSupabase = async () => {
      const current = getCurrentUser()
      if (!current) return
      const { data } = await supabase
        .from('users')
        .select('balance, vip_level, referral_count')
        .eq('id', current.username.toLowerCase())
        .single()
      if (data) {
        const updated = {
          ...current,
          balance: data.balance,
          vipLevel: data.vip_level,
          referralCount: data.referral_count,
        }
        saveUser(updated)
        setUser(updated)
      }
    }
    syncFromSupabase()
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const current = getCurrentUser()
      if (!current?.contracts.length) {
        setTick((t) => t + 1)
        return
      }
      const updated = tickContractsOneSecond(current)
      saveUser(updated)
      setUser(updated)
      setTick((t) => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [user?.username])

  const setView = useCallback((view: ViewId) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const login = useCallback(
    async (username: string, password: string) => {
      if (!loginUser(username, password)) return false
      const current = getCurrentUser()
      if (current) {
        const { data } = await supabase
          .from('users')
          .select('balance, vip_level, referral_count')
          .eq('id', username.toLowerCase())
          .single()
        if (data) {
          const updated = {
            ...current,
            balance: data.balance,
            vipLevel: data.vip_level,
            referralCount: data.referral_count,
          }
          saveUser(updated)
          setUser(updated)
        } else {
          refreshUser()
        }
      }
      setCurrentView('dashboard')
      return true
    },
    [refreshUser],
  )

  const register = useCallback(
    async (data: {
      username: string
      password: string
      email: string
      phone: string
      referralCode?: string
    }) => {
      const result = await registerUser(data)
      if (result.success) {
        refreshUser()
        setCurrentView('dashboard')
      }
      return result
    },
    [refreshUser],
  )

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
    setCurrentView('login')
    setAuthMode('login')
  }, [])

  const buyVip = useCallback(
    (tierId: number) => {
      if (!user) return { success: false, message: 'Please log in.' }
      const tierInfo = getTierById(tierId)
      if (!tierInfo) return { success: false, message: 'Invalid VIP package.' }
      if (user.balance < tierInfo.price) {
        return { success: false, message: 'Insufficient balance.' }
      }
      const contract = createContract(tierId)
      let updated: User = {
        ...user,
        balance: user.balance - tierInfo.price,
        vipLevel: Math.max(user.vipLevel, tierId),
        contracts: [...user.contracts, contract],
      }
      updated = addTransaction(
        updated,
        'vip_purchase',
        -tierInfo.price,
        `Activated ${tierInfo.name} — ${tierInfo.label}`,
      )
      persist(updated)
      return { success: true, message: `${tierInfo.name} contract activated!` }
    },
    [user, persist],
  )

  const submitDepositTxid = useCallback(
    (txid: string, amount: number) => {
      if (!user) return { success: false, message: 'Please log in.' }
      if (!txid.trim() || txid.length < 8) {
        return { success: false, message: 'Enter a valid TXID.' }
      }
      if (amount <= 0) return { success: false, message: 'Enter deposit amount.' }
      let updated: User = {
        ...user,
        balance: user.balance + amount,
        totalDeposited: user.totalDeposited + amount,
      }
      updated = addTransaction(updated, 'deposit', amount, `Deposit TXID: ${txid.slice(0, 16)}…`)
      persist(updated)
      return { success: true, message: `Deposit of ${amount} USDT recorded.` }
    },
    [user, persist],
  )

  const submitWithdrawal = useCallback(
    (amount: number) => {
      if (!user) return { success: false, message: 'Please log in.' }
      if (!hasVip1OrHigher(user)) {
        return { success: false, message: 'VIP 1 required before withdrawal.' }
      }
      if (amount < MIN_WITHDRAWAL) {
        return { success: false, message: `Minimum withdrawal: $${MIN_WITHDRAWAL} USDT.` }
      }
      if (user.balance < amount) return { success: false, message: 'Insufficient balance.' }
      if (!user.withdrawalAddress.trim()) {
        return { success: false, message: 'Set your withdrawal address in Me first.' }
      }
      let updated: User = {
        ...user,
        balance: user.balance - amount,
        totalWithdrawn: user.totalWithdrawn + amount,
      }
      updated = addTransaction(
        updated,
        'withdraw',
        -amount,
        `Withdraw to ${user.withdrawalAddress.slice(0, 12)}…`,
      )
      persist(updated)
      return { success: true, message: 'Withdrawal submitted.' }
    },
    [user, persist],
  )

  const updateWithdrawalAddress = useCallback(
    (address: string) => {
      if (!user) return
      persist({ ...user, withdrawalAddress: address })
    },
    [user, persist],
  )

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, 'email' | 'phone'>>) => {
      if (!user) return
      persist({ ...user, ...patch })
    },
    [user, persist],
  )

  const internalTransfer = useCallback(
    (amount: number, note: string) => {
      if (!user) return { success: false, message: 'Please log in.' }
      if (amount <= 0 || amount > user.balance) {
        return { success: false, message: 'Invalid transfer amount.' }
      }
      let updated = addTransaction(
        { ...user, balance: user.balance - amount },
        'transfer',
        -amount,
        note || 'Internal balance transfer',
      )
      persist(updated)
      return { success: true, message: `Transferred ${amount.toFixed(2)} USDT.` }
    },
    [user, persist],
  )

  const adminUpdateUser = useCallback(
    (username: string, patch: Partial<Pick<User, 'balance' | 'vipLevel' | 'referralCount'>>) => {
      const target = getAllUsers().find((u) => u.username.toLowerCase() === username.toLowerCase())
      if (!target) return
      const updated = { ...target, ...patch }
      saveUser(updated)
      setAllUsers(getAllUsers())
      if (user?.username.toLowerCase() === username.toLowerCase()) setUser(updated)
    },
    [user],
  )

  return (
    <AppContext.Provider
      value={{
        user,
        global,
        isAuthenticated: !!user,
        isAdmin,
        currentView,
        authMode,
        tick,
        setView,
        setAuthMode,
        login,
        register,
        logout,
        buyVip,
        submitDepositTxid,
        submitWithdrawal,
        updateWithdrawalAddress,
        updateProfile,
        internalTransfer,
        refreshUser,
        allUsers,
        adminUpdateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useGlobalState() {
  const { global, user } = useApp()
  return { ...global, username: user?.username ?? null }
}
