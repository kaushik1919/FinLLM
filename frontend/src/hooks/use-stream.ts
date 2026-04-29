'use client'

import { useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { streamMessage } from '@/lib/api-client'
import { readSseStream } from '@/lib/stream-parser'
import { useAuthStore } from '@/stores/auth-store'
import { useChatStore } from '@/stores/chat-store'

export function useStream(convId: string) {
  const token = useAuthStore((s) => s.token)
  const { startStream, appendDelta, setSources, finalizeStream } = useChatStore()
  const queryClient = useQueryClient()
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(
    async (content: string) => {
      if (!token) return

      abortRef.current?.abort()
      abortRef.current = new AbortController()

      startStream()

      try {
        const response = await streamMessage(token, convId, content)

        if (!response.ok) {
          finalizeStream()
          return
        }

        for await (const event of readSseStream(response)) {
          if (event.type === 'sources') {
            setSources(event.sources)
          } else if (event.type === 'delta') {
            appendDelta(event.delta)
          }
        }
      } finally {
        finalizeStream()
        queryClient.invalidateQueries({ queryKey: ['conversation', convId] })
      }
    },
    [token, convId, startStream, appendDelta, setSources, finalizeStream, queryClient],
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
    finalizeStream()
  }, [finalizeStream])

  return { send, abort }
}
