import { ADMIN_EMAIL, type Transaction, type User } from '../types'
import { DEPOSIT_ADDRESSES, generateUniqueReferralCode, REGISTRATION_BONUS } from '../data/vipTiers'
import { migrateUserContracts } from './contracts'
import { supabase } from './supabaseClient'

const USERS_KEY = 'apex-media-v2-users'
const SESSION_KEY = 'apex-media-v2-session'

type UserRecord = Record<string, User>

function normalizeUser(raw: User): User {
  const base: User = {
    username: raw.username,
    email: raw.email,
    phone: raw.phone ?? '',
    password: raw.password,
    balance: raw.balance ?? 0,
    vipLevel: raw.vipLevel ?? 0,
    totalDeposited: raw.totalDeposited ?? 0,
    totalWithdrawn: raw.totalWithdrawn ?? 0,
    referralCount: raw.referralCount ?? 0,
    referralCode: raw.referralCode ?? '',
    referredBy: raw.referredBy ?? null,
    withdrawalAddress: raw.withdrawalAddress ?? '',
    transactions: raw.transactions ?? [],
    contracts: raw.contracts ?? [],
  }
  return migrateUserContracts(base)
}

function loadUsers(): UserRecord {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return seedDefaultUsers()
    const parsed = JSON.parse(raw) as UserRecord
    const normalized: UserRecord = {}
    for (const [k, v] of Object.entries(parsed)) {
      normalized[k] = normalizeUser(v)
    }
    return normalized
  } catch {
    return seedDefaultUsers()
  }
}

function saveUsers(users: UserRecord) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function seedDefaultUsers(): UserRecord {
  const codes: string[] = []
  const admin: User = normalizeUser({
    username: 'admin',
    email: ADMIN_EMAIL,
    phone: '',
    password: 'admin123',
    balance: 10000,
    vipLevel: 5,
    totalDeposited: 10000,
    totalWithdrawn: 0,
    referralCount: 0,
    referralCode: generateUniqueReferralCode(codes),
    referredBy: null,
    withdrawalAddress: '',
    transactions: [],
    contracts: [],
  })
  codes.push(admin.referralCode)
  const users = { [admin.username.toLowerCase()]: admin }
  saveUsers(users)
  return users
}

export function getSessionUsername(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setSession(username: string | null) {
  if (username) localStorage.setItem(SESSION_KEY, username)
  else localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  const session = getSessionUsername()
  if (!session) return null
  const users = loadUsers()
  const u = users[session.toLowerCase()]
  return u ? normalizeUser(u) : null
}

export function getAllUsers(): User[] {
  return Object.values(loadUsers())
}

export function findUserByReferralCode(code: string): User | null {
  const normalized = code.trim().toLowerCase()
  return getAllUsers().find((u) => u.referralCode.toLowerCase() === normalized) ?? null
}

export function saveUser(user: User) {
  const users = loadUsers()
  users[user.username.toLowerCase()] = user
  saveUsers(users)
  supabase.from('users').upsert({
    id: user.username.toLowerCase(),
    username: user.username,
    email: user.email,
    balance: user.balance,
    vip_level: user.vipLevel,
    referral_count: user.referralCount,
  })
}

export async function registerUser(data: {
  username: string
  password: string
  email: string
  phone: string
  referralCode?: string
}): Promise<{ success: boolean; error?: string }> {
  const key = data.username.toLowerCase()
  const users = loadUsers()
  if (users[key]) return { success: false, error: 'Username already exists' }

  let referredBy: string | null = null
  if (data.referralCode?.trim()) {
    const inviter = findUserByReferralCode(data.referralCode)
    if (!inviter) return { success: false, error: 'Invalid referral code' }
    referredBy = inviter.username
    inviter.referralCount += 1
    saveUser(inviter)
  }

  const existingCodes = getAllUsers().map((u) => u.referralCode)
  const user: User = {
    username: data.username,
    email: data.email,
    phone: data.phone,
    password: data.password,
    balance: REGISTRATION_BONUS,
    vipLevel: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    referralCount: 0,
    referralCode: generateUniqueReferralCode(existingCodes),
    referredBy,
    withdrawalAddress: '',
    transactions: [
      {
        id: crypto.randomUUID(),
        type: 'bonus',
        amount: REGISTRATION_BONUS,
        note: 'Welcome registration bonus',
        timestamp: new Date().toISOString(),
      },
    ],
    contracts: [],
  }

  users[key] = user
  saveUsers(users)
  setSession(data.username)

  await supabase.from('users').upsert({
    id: key,
    username: user.username,
    email: user.email,
    balance: user.balance,
    vip_level: user.vipLevel,
    referral_count: user.referralCount,
  })

  return { success: true }
}

export function loginUser(username: string, password: string): boolean {
  const users = loadUsers()
  const user = users[username.toLowerCase()]
  if (!user || user.password !== password) return false
  setSession(username)
  return true
}

export function logoutUser() {
  setSession(null)
}

export function addTransaction(
  user: User,
  type: Transaction['type'],
  amount: number,
  note: string,
): User {
  return {
    ...user,
    transactions: [
      {
        id: crypto.randomUUID(),
        type,
        amount,
        note,
        timestamp: new Date().toISOString(),
      },
      ...user.transactions,
    ],
  }
}

export { DEPOSIT_ADDRESSES }
