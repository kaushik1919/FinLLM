'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthStore } from '@/stores/auth-store'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const hydrated = useAuthStore((s) => s.hydrated)
  const hydrate = useAuthStore((s) => s.hydrate)
  const router = useRouter()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (hydrated && !token) {
      router.replace('/login')
    }
  }, [hydrated, token, router])

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <span className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!token) return null

  return <AppShell>{children}</AppShell>
}