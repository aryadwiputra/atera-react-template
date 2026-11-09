import { useSyncExternalStore } from 'react'
import { getSession, signOut } from '@/lib/auth'

const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const notifyAuthChanged = () => listeners.forEach((listener) => listener())

export function useAuth() {
  const session = useSyncExternalStore(subscribe, getSession, () => null)
  return { session, isAuthenticated: session !== null, signOut: () => { signOut(); notifyAuthChanged() } }
}
