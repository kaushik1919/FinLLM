'use client'

import { use } from 'react'
import { ChatWorkspace } from '@/components/chat/ChatWorkspace'

interface ChatConvPageProps {
  params: Promise<{ id: string }>
}

export default function ChatConvPage({ params }: ChatConvPageProps) {
  const { id } = use(params)
  return <ChatWorkspace convId={id} />
}