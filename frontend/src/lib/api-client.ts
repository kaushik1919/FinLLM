import type {
  Conversation,
  ConversationDetail,
  Document,
  LoginPayload,
  RegisterPayload,
  StartConversationPayload,
  TokenResponse,
  User,
} from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(detail)
    this.name = 'ApiClientError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers = {}, ...rest } = options

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    },
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.detail ?? detail
    } catch {
      // non-JSON error body
    }
    throw new ApiClientError(res.status, detail)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<TokenResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) => {
    const form = new URLSearchParams()
    form.set('username', payload.username)
    form.set('password', payload.password)
    return request<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' } as Record<string, string>,
      body: form.toString(),
    })
  },

  me: (token: string) =>
    request<User>('/api/v1/auth/me', { token }),
}

// ── Documents ─────────────────────────────────────────────────────────────────

export const documentsApi = {
  list: (token: string) =>
    request<Document[]>('/api/v1/documents', { token }),

  get: (token: string, id: string) =>
    request<Document>(`/api/v1/documents/${id}`, { token }),

  upload: async (token: string, file: File): Promise<Document> => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE_URL}/api/v1/documents/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (!res.ok) {
      let detail = res.statusText
      try {
        const body = await res.json()
        detail = body.detail ?? detail
      } catch {
        // non-JSON error body
      }
      throw new ApiClientError(res.status, detail)
    }
    return res.json()
  },

  delete: (token: string, id: string) =>
    request<void>(`/api/v1/documents/${id}`, { method: 'DELETE', token }),
}

// ── Conversations ─────────────────────────────────────────────────────────────

export const conversationsApi = {
  list: (token: string) =>
    request<Conversation[]>('/api/v1/chat/history', { token }),

  get: (token: string, id: string) =>
    request<ConversationDetail>(`/api/v1/chat/${id}`, { token }),

  start: (token: string, payload: StartConversationPayload) =>
    request<Conversation>('/api/v1/chat/start', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
}

// ── Streaming ─────────────────────────────────────────────────────────────────
// Returns the raw Response so the caller can consume the body as an SSE stream.

export function streamMessage(
  token: string,
  convId: string,
  content: string,
): Promise<Response> {
  return fetch(`${BASE_URL}/api/v1/chat/${convId}/message`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
}
