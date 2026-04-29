'use client'

import { create } from 'zustand'
import type { User } from '@/lib/types'

interface AuthState {
  token: string | null
  user: User | null
  hydrated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  setAuth: (token, user) => {
    sessionStorage.setItem('fin_token', token)
    set({ token, user })
  },

  clearAuth: () => {
    sessionStorage.removeItem('fin_token')
    set({ token: null, user: null })
  },

  hydrate: () => {
    const token = sessionStorage.getItem('fin_token')
    set({ token: token ?? null, hydrated: true })
  },
}))
