'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { conversationsApi } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import type { StartConversationPayload } from '@/lib/types'

export function useConversations() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi.list(token!),
    enabled: !!token,
    staleTime: 10_000,
  })
}

export function useConversation(id: string) {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => conversationsApi.get(token!, id),
    enabled: !!token && !!id,
    staleTime: 5_000,
  })
}

export function useStartConversation() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StartConversationPayload) =>
      conversationsApi.start(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
