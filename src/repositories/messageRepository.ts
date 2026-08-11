import { prisma } from '../lib/db'
import type { MessageDTO } from '../types'

export const messageRepository = {
  async findByConversationId(conversationId: string): Promise<MessageDTO[]> {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    })
  },

  async create(conversationId: string, role: 'user' | 'assistant', content: string): Promise<MessageDTO> {
    return prisma.message.create({ data: { conversationId, role, content } })
  },

  async delete(id: string): Promise<void> {
    await prisma.message.delete({ where: { id } })
  },
}
