import { env } from '../../config/env'
import type { ChatMessage, ChatOptions, ProviderConfig, IAIProvider } from './types'

/**
 * 9 Router provider — OpenAI-compatible streaming endpoint.
 *
 * Resolved per-request from a saved model record:
 *   config.baseUrl  — override, else NINE_ROUTER_BASE_URL
 *   config.apiKey   — override, else NINE_ROUTER_API_KEY
 *
 * If no API key is resolved, it falls back to a deterministic simulated
 * stream so the chat flow still works in local dev.
 */
export class NineRouterProvider implements IAIProvider {
  async *stream(messages: ChatMessage[], config: ProviderConfig, options?: ChatOptions): AsyncGenerator<string> {
    const apiKey = config.apiKey || env.NINE_ROUTER_API_KEY
    const baseUrl = (config.baseUrl || env.NINE_ROUTER_BASE_URL || 'https://api.nineai.com').replace(/\/$/, '')

    if (!apiKey) {
      yield* this.simulate(messages, config.model)
      return
    }

    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        stream: true,
      }),
    })

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '')
      throw new Error(`AI provider error (${res.status}): ${text.slice(0, 200)}`)
    }

    yield* this.parseStream(res.body)
  }

  /** Parse OpenAI-style SSE stream: `data: {"choices":[{"delta":{"content":"..."}}]}` */
  private async *parseStream(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let boundary = buffer.indexOf('\n\n')
      while (boundary !== -1) {
        const raw = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)

        for (const line of raw.split('\n')) {
          if (!line.startsWith('data:')) continue
          const payload = line.slice(5).trim()
          if (payload === '[DONE]') return
          try {
            const json = JSON.parse(payload)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) yield delta
          } catch {
            // ignore malformed chunk
          }
        }

        boundary = buffer.indexOf('\n\n')
      }
    }
  }

  /** Fallback when no API key is configured. */
  private async *simulate(messages: ChatMessage[], model: string): AsyncGenerator<string> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
    const reply = `[dev-mode] Simulated ${model} response to: "${lastUser.slice(0, 120)}"`
    const words = reply.split(' ')
    for (let i = 0; i < words.length; i++) {
      yield words[i] + (i < words.length - 1 ? ' ' : '')
      await new Promise((r) => setTimeout(r, 20))
    }
  }
}
