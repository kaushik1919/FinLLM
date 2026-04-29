'use client'

import { useRef, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { SourcePanel } from './SourcePanel'
import { useStream } from '@/hooks/use-stream'
import { useConversation } from '@/hooks/use-conversations'
import { useChatStore } from '@/stores/chat-store'
import { useUiStore, selectSourcePanelOpen } from '@/stores/ui-store'
import { cn } from '@/lib/utils'

interface ChatWorkspaceProps {
  convId: string
}

export function ChatWorkspace({ convId }: ChatWorkspaceProps) {
  const { data: conv } = useConversation(convId)
  const { send, abort } = useStream(convId)
  const isStreaming = useChatStore((s) => s.isStreaming)
  const isSourceOpen = useUiStore(selectSourcePanelOpen)

  return (
    <div className="flex flex-1 overflow-hidden">
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-200',
          isSourceOpen && 'mr-source-panel',
        )}
      >
        <TopBar title={conv?.title ?? 'Chat'} />

        <div className="flex-1 overflow-y-auto">
          <MessageList messages={conv?.messages ?? []} />
        </div>

        <div className="border-t border-border bg-bg-base p-3">
          <ChatInput
            onSend={send}
            onAbort={abort}
            isStreaming={isStreaming}
          />
          <p className="mt-1.5 text-center text-2xs text-text-muted">
            AI can make mistakes. Verify critical financial information.
          </p>
        </div>
      </div>

      <SourcePanel />
    </div>
  )
}
