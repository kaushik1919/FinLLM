'use client'

import { Sidebar } from './Sidebar'
import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      {/* Push content right of sidebar on large screens */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-sidebar">
        {children}
      </div>
    </div>
  )
}
