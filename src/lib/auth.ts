import type { AuthResult, AuthSession } from './data/types'

const sessionKey = 'atera_session'
const accountsKey = 'atera_accounts'
const demoAccount = { email: 'demo@example.com', password: 'ZenithDemo2026!', name: 'Demo User' }

type Account = typeof demoAccount
let sessionCache: AuthSession | null | undefined

const readAccounts = (): Account[] => {
  if (typeof localStorage === 'undefined') return [demoAccount]
  const stored = localStorage.getItem(accountsKey)
  if (!stored) return [demoAccount]
  try {
    return [demoAccount, ...JSON.parse(stored) as Account[]]
  } catch {
    return [demoAccount]
  }
}

export const getSession = (): AuthSession | null => {
  if (sessionCache !== undefined) return sessionCache
  if (typeof localStorage === 'undefined') { sessionCache = null; return sessionCache }
  const stored = localStorage.getItem(sessionKey)
  if (!stored) { sessionCache = null; return sessionCache }
  try { sessionCache = JSON.parse(stored) as AuthSession } catch { sessionCache = null }
  return sessionCache
}

export const isAuthenticated = () => getSession() !== null

export const signIn = (email: string, password: string): AuthResult => {
  const account = readAccounts().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
  if (!account) return { ok: false, message: 'invalidCredentials' }
  const session: AuthSession = { email: account.email, name: account.name, authenticatedAt: new Date().toISOString() }
  localStorage.setItem(sessionKey, JSON.stringify(session))
  sessionCache = session
  return { ok: true, session }
}

export const signUp = (input: Account): AuthResult => {
  if (!input.email.includes('@')) return { ok: false, message: 'invalidEmail' }
  if (readAccounts().some((account) => account.email.toLowerCase() === input.email.toLowerCase())) return { ok: false, message: 'accountExists' }
  const accounts = [...readAccounts().filter((account) => account.email !== demoAccount.email), input]
  localStorage.setItem(accountsKey, JSON.stringify(accounts))
  return signIn(input.email, input.password)
}

export const signOut = () => { localStorage.removeItem(sessionKey); sessionCache = null }
export const getDemoCredentials = () => ({ email: demoAccount.email, password: demoAccount.password })
