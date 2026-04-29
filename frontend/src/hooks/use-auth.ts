'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi, ApiClientError } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import type { LoginPayload, RegisterPayload } from '@/lib/types'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const token = await authApi.login(payload)
      const user = await authApi.me(token.access_token)
      return { token, user }
    },
    onSuccess: ({ token, user }) => {
      setAuth(token.access_token, user)
      router.push('/chat')
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const token = await authApi.register(payload)
      const user = await authApi.me(token.access_token)
      return { token, user }
    },
    onSuccess: ({ token, user }) => {
      setAuth(token.access_token, user)
      router.push('/chat')
    },
  })
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const router = useRouter()
  return () => {
    clearAuth()
    router.push('/login')
  }
}

export function isApiError(err: unknown): err is ApiClientError {
  return err instanceof ApiClientError
}
