'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export function useDocuments() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['documents'],
    queryFn: () => documentsApi.list(token!),
    enabled: !!token,
    staleTime: 30_000,
  })
}

export function useUploadDocument() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => documentsApi.upload(token!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useDeleteDocument() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => documentsApi.delete(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
