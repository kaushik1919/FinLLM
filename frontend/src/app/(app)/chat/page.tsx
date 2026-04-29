'use client'

import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { useConversations } from '@/hooks/use-conversations'
import { useStartConversation } from '@/hooks/use-conversations'
import { MessageSquare, Plus } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ChatPage() {
  const router = useRouter()
  const { data: conversations, isLoading } = useConversations()
  const startConv = useStartConversation()

  async function handleNew() {
    const conv = await startConv.mutateAsync({})
    router.push(`/chat/${conv.id}`)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Chat" />
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="label-xs text-text-muted uppercase tracking-wider">Conversations</h2>
          <Button size="sm" onClick={handleNew} loading={startConv.isPending}>
            <Plus size={12} />
            New Chat
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-bg-elevated animate-pulse" />
            ))}
          </div>
        ) : conversations?.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={20} />}
            title="No conversations yet"
            description="Start a new chat to ask questions about your financial documents."
            action={
              <Button size="sm" onClick={handleNew} loading={startConv.isPending}>
                <Plus size={12} />
                Start Chat
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            {conversations?.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="panel flex items-center gap-3 p-3 hover:border-border-strong transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated text-text-muted">
                  <MessageSquare size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {conv.title || 'Untitled'}
                  </p>
                  <p className="text-2xs text-text-muted">{formatDateTime(conv.updated_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
