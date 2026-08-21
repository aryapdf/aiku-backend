import { modelRepository, agentRepository } from '../repositories'
import { getAIProvider } from './providers'
import type { ChatMessage } from './providers/types'

export interface CreateModelInput {
  name: string
  provider?: string
  model: string
  baseUrl?: string
  apiKey?: string
}

export interface UpdateModelInput {
  name?: string
  provider?: string
  model?: string
  baseUrl?: string | null
  apiKey?: string | null
}

export interface CreateAgentInput {
  name: string
  description?: string
  systemPrompt: string
}

export interface UpdateAgentInput {
  name?: string
  description?: string | null
  systemPrompt?: string
}

export const modelService = {
  async list(userId: string) {
    return modelRepository.findByUserId(userId)
  },

  async getById(id: string, userId: string) {
    const model = await modelRepository.findById(id)
    if (!model) throw new Error('Model not found')
    if (model.userId !== userId) throw new Error('Access denied')
    return model
  },

  async create(userId: string, input: CreateModelInput) {
    const existing = await modelRepository.findByName(userId, input.name)
    if (existing) throw new Error('Model name already exists')
    return modelRepository.create({
      userId,
      name: input.name,
      provider: input.provider || 'nine-router',
      model: input.model,
      baseUrl: input.baseUrl,
      apiKey: input.apiKey,
    })
  },

  async update(id: string, userId: string, input: UpdateModelInput) {
    const model = await modelRepository.findById(id)
    if (!model) throw new Error('Model not found')
    if (model.userId !== userId) throw new Error('Access denied')
    return modelRepository.update(id, input)
  },

  async delete(id: string, userId: string) {
    const model = await modelRepository.findById(id)
    if (!model) throw new Error('Model not found')
    if (model.userId !== userId) throw new Error('Access denied')
    await modelRepository.delete(id)
  },

  /**
   * Test a model config (saved or unsaved) with a short prompt.
   * Streams the result back to the caller without persisting anything.
   */
  async *test(input: { provider?: string; model: string; baseUrl?: string; apiKey?: string; message?: string }) {
    const provider = getAIProvider(input.provider)
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful assistant. Reply briefly.' },
      { role: 'user', content: input.message || 'Say hello in one short sentence.' },
    ]
    const config = {
      provider: input.provider || 'nine-router',
      model: input.model,
      baseUrl: input.baseUrl,
      apiKey: input.apiKey,
    }
    for await (const delta of provider.stream(messages, config)) {
      yield delta
    }
  },
}

export const agentService = {
  async list(userId: string) {
    return agentRepository.findByUserId(userId)
  },

  async getById(id: string, userId: string) {
    const agent = await agentRepository.findById(id)
    if (!agent) throw new Error('Agent not found')
    if (agent.userId !== userId) throw new Error('Access denied')
    return agent
  },

  async create(userId: string, input: CreateAgentInput) {
    const existing = await agentRepository.findByName(userId, input.name)
    if (existing) throw new Error('Agent name already exists')
    return agentRepository.create({
      userId,
      name: input.name,
      description: input.description,
      systemPrompt: input.systemPrompt,
    })
  },

  async update(id: string, userId: string, input: UpdateAgentInput) {
    const agent = await agentRepository.findById(id)
    if (!agent) throw new Error('Agent not found')
    if (agent.userId !== userId) throw new Error('Access denied')
    return agentRepository.update(id, input)
  },

  async delete(id: string, userId: string) {
    const agent = await agentRepository.findById(id)
    if (!agent) throw new Error('Agent not found')
    if (agent.userId !== userId) throw new Error('Access denied')
    await agentRepository.delete(id)
  },
}
