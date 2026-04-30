import type { StreamEvent } from './types'

export function parseSseLine(line: string): StreamEvent | null {
  if (!line.startsWith('data: ')) return null
  const raw = line.slice(6).trim()
  if (raw === '[DONE]') return null
  try {
    return JSON.parse(raw) as StreamEvent
  } catch {
    return null
  }
}

export async function* readSseStream(
  response: Response,
): AsyncGenerator<StreamEvent> {
  if (!response.body) return

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const event = parseSseLine(line.trim())
        if (event) yield event
      }
    }

    if (buffer.trim()) {
      const event = parseSseLine(buffer.trim())
      if (event) yield event
    }
  } finally {
    reader.releaseLock()
  }
}
