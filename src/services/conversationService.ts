import { conversationRepository } from '../repositories'
import type { CreateConversationInput, UpdateConversationInput } from '../types'

export const conversationService = {
  async list(userId: string, projectId?: string) {
    if (projectId) return conversationRepository.findByProjectId(projectId)
    return conversationRepository.findByUserId(userId)
  },

  async getById(id: string) {
    const conv = await conversationRepository.findById(id)
    if (!conv) throw new Error('Conversation not found')
    return conv
  },

  async create(input: CreateConversationInput & { userId: string }) {
    return conversationRepository.create({
      projectId: input.projectId ?? null,
      userId: input.userId,
      title: input.title || 'New Chat',
      model: input.model,
      agentId: input.agentId,
    })
  },

  async update(id: string, input: UpdateConversationInput) {
    const conv = await conversationRepository.findById(id)
    if (!conv) throw new Error('Conversation not found')
    return conversationRepository.update(id, input)
  },

  async delete(id: string) {
    const conv = await conversationRepository.findById(id)
    if (!conv) throw new Error('Conversation not found')
    await conversationRepository.delete(id)
  },
}
