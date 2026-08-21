export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  model: string
  temperature?: number
  maxTokens?: number
}

/**
 * Per-request provider configuration, resolved from a saved model record.
 * `baseUrl` and `apiKey` override the global env defaults when present.
 */
export interface ProviderConfig {
  provider: string
  model: string
  baseUrl?: string | null
  apiKey?: string | null
}

/**
 * Pluggable AI provider contract (strategy pattern).
 * Each provider streams text deltas back to the caller.
 */
export interface IAIProvider {
  stream(messages: ChatMessage[], config: ProviderConfig, options?: ChatOptions): AsyncGenerator<string>
}
