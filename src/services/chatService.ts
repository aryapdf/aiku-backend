import { messageRepository, conversationRepository, modelRepository, agentRepository, settingsRepository } from '../repositories'
import { getAIProvider } from './providers'
import type { ChatMessage } from './providers/types'
import type { SendMessageInput } from '../types'
import { env } from '../config/env'

/** Default system prompt when no agent is attached to a conversation. */
const DEFAULT_SYSTEM_PROMPT = 'You are a helpful and concise AI assistant. Answer accurately and directly.'

export const chatService = {
  async getMessages(conversationId: string) {
    return messageRepository.findByConversationId(conversationId)
  },

  async *streamMessage(input: SendMessageInput & { userId: string }) {
    // Persist the user message first so it becomes part of the context.
    await messageRepository.create(input.conversationId, 'user', input.content)

    const modelConfig = await this.resolveModel(input.userId, input.model)
    const systemPrompt = await this.resolveSystemPrompt(input.userId, input.agentId)

    // Build context: system prompt + prior history + current message.
    const history = await this.buildHistory(input.conversationId, input.content)
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
    ]

    yield { type: 'message_start' as const, conversationId: input.conversationId }

    const provider = getAIProvider(modelConfig.provider)
    let acc = ''
    for await (const delta of provider.stream(messages, modelConfig)) {
      acc += delta
      yield { type: 'content_block_delta' as const, delta: { type: 'text_delta' as const, text: delta } }
    }

    const aiMsg = await messageRepository.create(input.conversationId, 'assistant', acc)
    yield { type: 'message_stop' as const, messageId: aiMsg.id }
  },

  /** Resolve a saved model record, or fall back to a default built from env. */
  async resolveModel(userId: string, modelId?: string) {
    if (modelId) {
      const model = await modelRepository.findById(modelId)
      if (model && model.userId === userId) {
        return { provider: model.provider, model: model.model, baseUrl: model.baseUrl, apiKey: model.apiKey }
      }
    }

    // Fallback: user's first saved model, else env-driven default.
    const models = await modelRepository.findByUserId(userId)
    if (models.length > 0) {
      const m = models[0]
      return { provider: m.provider, model: m.model, baseUrl: m.baseUrl, apiKey: m.apiKey }
    }

    // Fallback: user's Nine Router settings (workspace-level credentials).
    const settings = await settingsRepository.findByUserId(userId)
    return {
      provider: 'nine-router',
      model: settings.defaultModel || env.NINE_ROUTER_MODEL,
      baseUrl: settings.nineRouterBaseUrl || env.NINE_ROUTER_BASE_URL,
      apiKey: settings.nineRouterApiKey || env.NINE_ROUTER_API_KEY,
    }
  },

  /** Resolve an agent's system prompt, or the default prompt. */
  async resolveSystemPrompt(userId: string, agentId?: string) {
    if (agentId) {
      const agent = await agentRepository.findById(agentId)
      if (agent && agent.userId === userId) return agent.systemPrompt
    }
    return DEFAULT_SYSTEM_PROMPT
  },

  async buildHistory(conversationId: string, currentContent: string): Promise<ChatMessage[]> {
    const conv = await conversationRepository.findById(conversationId)
    const prior = conv?.messages ?? []
    return [...prior, { role: 'user' as const, content: currentContent }].map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  },
}
