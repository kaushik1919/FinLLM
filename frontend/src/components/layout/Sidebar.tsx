'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { MessageSquare, FileText, ChevronRight, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore, selectSidebarOpen } from '@/stores/ui-store'
import { useConversations } from '@/hooks/use-conversations'
import { useStartConversation } from '@/hooks/use-conversations'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/documents', label: 'Documents', icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const sidebarOpen = useUiStore(selectSidebarOpen)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const { data: conversations } = useConversations()
  const startConv = useStartConversation()

  async function handleNewChat() {
    const conv = await startConv.mutateAsync({})
    router.push(`/chat/${conv.id}`)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-30 flex h-full w-sidebar flex-col border-r border-border bg-bg-surface transition-transform duration-200 ease-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-topbar items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            Fin<span className="text-accent">LLM</span>
          </span>
          <button onClick={toggleSidebar} className="p-1 text-text-muted hover:text-text-primary lg:hidden">
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded px-2.5 py-1.5 text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Recent conversations */}
        <div className="flex flex-col flex-1 min-h-0 mt-2">
          <div className="flex items-center justify-between px-4 py-1">
            <span className="label-xs text-text-muted uppercase tracking-wider">Recent</span>
            <button
              onClick={handleNewChat}
              className="text-text-muted hover:text-text-primary transition-colors"
              title="New chat"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {conversations?.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className={cn(
                  'flex items-center gap-2 rounded px-2.5 py-1.5 text-xs transition-colors group',
                  params?.id === conv.id
                    ? 'bg-bg-elevated text-text-primary'
                    : 'text-text-muted hover:bg-bg-hover hover:text-text-secondary',
                )}
              >
                <span className="flex-1 truncate">{conv.title || 'Untitled'}</span>
                <ChevronRight size={10} className="shrink-0 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        {/* New chat CTA */}
        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleNewChat}
            loading={startConv.isPending}
          >
            <Plus size={12} />
            New Chat
          </Button>
        </div>
      </aside>
    </>
  )
}
