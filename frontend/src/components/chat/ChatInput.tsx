'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (content: string) => void
  onAbort: () => void
  isStreaming: boolean
  disabled?: boolean
}

export function ChatInput({ onSend, onAbort, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || isStreaming || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex items-end gap-2 rounded-lg border border-border bg-bg-elevated p-2 focus-within:border-accent/50 transition-colors">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => { setValue(e.target.value); handleInput() }}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your documents…"
        disabled={disabled}
        className={cn(
          'flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted',
          'focus:outline-none disabled:opacity-50 leading-relaxed py-0.5',
        )}
        style={{ minHeight: '22px', maxHeight: '160px' }}
      />
      <button
        onClick={isStreaming ? onAbort : submit}
        disabled={!isStreaming && (!value.trim() || disabled)}
        className={cn(
          'shrink-0 flex h-7 w-7 items-center justify-center rounded transition-colors',
          isStreaming
            ? 'bg-danger/10 text-danger hover:bg-danger/20'
            : 'bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:pointer-events-none',
        )}
        title={isStreaming ? 'Stop' : 'Send'}
      >
        {isStreaming ? <Square size={12} fill="currentColor" /> : <Send size={12} />}
      </button>
    </div>
  )
}
