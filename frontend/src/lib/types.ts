// ── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
}

// ── Documents ────────────────────────────────────────────────────────────────

export type DocumentStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface Document {
  id: string
  owner_id: string
  filename: string
  file_path: string
  file_size: number
  status: DocumentStatus
  chunk_count: number
  error_message: string | null
  created_at: string
  updated_at: string
}

// ── Conversations & Messages ─────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant'

export interface MessageSource {
  document_id: string | null
  filename: string | null
  chunk_index: number | null
}

export interface Message {
  id: string
  conversation_id: string
  role: MessageRole
  content: string
  sources: MessageSource[] | null
  created_at: string
}

export interface Conversation {
  id: string
  owner_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ConversationDetail extends Conversation {
  messages: Message[]
}

export interface StartConversationPayload {
  title?: string
}

export interface ChatMessagePayload {
  content: string
}

// ── Streaming SSE ────────────────────────────────────────────────────────────

export interface StreamSourcesEvent {
  type: 'sources'
  sources: MessageSource[]
}

export interface StreamDeltaEvent {
  type: 'delta'
  delta: string
}

export type StreamEvent = StreamSourcesEvent | StreamDeltaEvent

// ── UI State ─────────────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export interface UploadingFile {
  id: string
  filename: string
  size: number
  status: UploadStatus
  error?: string
}

// ── API ──────────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string
  status: number
}
