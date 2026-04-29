'use client'

import { create } from 'zustand'
import type { MessageSource } from '@/lib/types'

interface ChatState {
  activeConvId: string | null
  isStreaming: boolean
  streamingContent: string
  currentSources: MessageSource[]

  setActiveConv: (id: string | null) => void
  startStream: () => void
  appendDelta: (delta: string) => void
  setSources: (sources: MessageSource[]) => void
  finalizeStream: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  activeConvId: null,
  isStreaming: false,
  streamingContent: '',
  currentSources: [],

  setActiveConv: (id) => set({ activeConvId: id }),

  startStream: () =>
    set({ isStreaming: true, streamingContent: '', currentSources: [] }),

  appendDelta: (delta) =>
    set((s) => ({ streamingContent: s.streamingContent + delta })),

  setSources: (sources) => set({ currentSources: sources }),

  finalizeStream: () => set({ isStreaming: false }),
}))
