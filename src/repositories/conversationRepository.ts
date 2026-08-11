import { prisma } from '../lib/db'
import type { ConversationDTO } from '../types'

export const conversationRepository = {
  async findByProjectId(projectId: string): Promise<ConversationDTO[]> {
    return prisma.conversation.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    })
  },

  async findById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    })
  },

  async create(data: { projectId: string; userId: string; title: string; model?: string }) {
    return prisma.conversation.create({ data })
  },

  async update(id: string, data: { title?: string; model?: string }) {
    return prisma.conversation.update({ where: { id }, data })
  },

  async delete(id: string): Promise<void> {
    await prisma.conversation.delete({ where: { id } })
  },
}
