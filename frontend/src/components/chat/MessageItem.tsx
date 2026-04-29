import { cn } from '@/lib/utils'
import { CitationChip } from './CitationChip'
import { LoadingDots } from '@/components/shared/LoadingDots'
import type { Message, MessageSource } from '@/lib/types'

interface MessageItemProps {
  message?: Message
  streamingContent?: string
  isStreaming?: boolean
  sources?: MessageSource[]
}

export function MessageItem({ message, streamingContent, isStreaming, sources }: MessageItemProps) {
  const isUser = message?.role === 'user' || (!message && false)
  const role = message?.role ?? 'assistant'
  const content = message?.content ?? streamingContent ?? ''
  const messageSources = message?.sources ?? sources ?? []

  return (
    <div className={cn('flex gap-3 animate-fade-in', role === 'user' && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded text-2xs font-medium mt-0.5',
          role === 'user'
            ? 'bg-accent/20 text-accent'
            : 'bg-bg-elevated border border-border text-text-muted',
        )}
      >
        {role === 'user' ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[80%] flex flex-col gap-1.5', role === 'user' && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm leading-relaxed',
            role === 'user'
              ? 'bg-accent/10 text-text-primary border border-accent/20'
              : 'bg-bg-elevated text-text-primary border border-border',
          )}
        >
          {isStreaming && !content ? (
            <LoadingDots />
          ) : (
            <span className="whitespace-pre-wrap">{content}</span>
          )}
          {isStreaming && content && <LoadingDots className="ml-1 inline-flex" size="sm" />}
        </div>

        {/* Sources */}
        {messageSources.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            {messageSources.map((src, i) => (
              <CitationChip key={i} index={i} source={src} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
