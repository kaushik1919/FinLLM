'use client'

import { useEffect, useRef } from 'react'
import { MessageItem } from './MessageItem'
import { EmptyState } from '@/components/shared/EmptyState'
import { MessageSquare } from 'lucide-react'
import { useChatStore } from '@/stores/chat-store'
import type { Message } from '@/lib/types'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isStreaming = useChatStore((s) => s.isStreaming)
  const streamingContent = useChatStore((s) => s.streamingContent)
  const currentSources = useChatStore((s) => s.currentSources)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  if (messages.length === 0 && !isStreaming) {
    return (
      <EmptyState
        icon={<MessageSquare size={20} />}
        title="Start a conversation"
        description="Ask questions about your uploaded financial documents."
        className="flex-1"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      {isStreaming && (
        <MessageItem
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          sources={currentSources}
        />
      )}
      <div ref={bottomRef} />
    </div>
  )
}
