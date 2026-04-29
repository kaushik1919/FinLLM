'use client'

import { Menu, LogOut, User } from 'lucide-react'
import { useUiStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title?: string
}

export function TopBar({ title }: TopBarProps) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <header className="flex h-topbar items-center justify-between border-b border-border bg-bg-surface px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1 text-text-muted hover:text-text-primary transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={16} />
        </button>
        {title && <h1 className="text-sm font-medium text-text-primary">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <User size={12} />
          <span className="hidden sm:inline">{user?.email}</span>
        </div>
        <button
          onClick={logout}
          className="p-1.5 text-text-muted hover:text-danger transition-colors rounded"
          title="Sign out"
        >
          <LogOut size={13} />
        </button>
      </div>
    </header>
  )
}
