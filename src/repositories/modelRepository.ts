import { prisma } from '../lib/db'

export interface AIModelDTO {
  id: string
  userId: string
  name: string
  provider: string
  model: string
  baseUrl: string | null
  apiKey: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AgentDTO {
  id: string
  userId: string
  name: string
  description: string | null
  systemPrompt: string
  createdAt: Date
  updatedAt: Date
}

export const modelRepository = {
  async findByUserId(userId: string): Promise<AIModelDTO[]> {
    return prisma.aiModel.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })
  },

  async findById(id: string): Promise<AIModelDTO | null> {
    return prisma.aiModel.findUnique({ where: { id } })
  },

  async findByName(userId: string, name: string): Promise<AIModelDTO | null> {
    return prisma.aiModel.findFirst({ where: { userId, name } })
  },

  async create(data: { userId: string; name: string; provider: string; model: string; baseUrl?: string; apiKey?: string }): Promise<AIModelDTO> {
    return prisma.aiModel.create({ data })
  },

  async update(id: string, data: { name?: string; provider?: string; model?: string; baseUrl?: string | null; apiKey?: string | null }): Promise<AIModelDTO> {
    return prisma.aiModel.update({ where: { id }, data })
  },

  async delete(id: string): Promise<void> {
    await prisma.aiModel.delete({ where: { id } })
  },
}

export const agentRepository = {
  async findByUserId(userId: string): Promise<AgentDTO[]> {
    return prisma.agent.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })
  },

  async findById(id: string): Promise<AgentDTO | null> {
    return prisma.agent.findUnique({ where: { id } })
  },

  async findByName(userId: string, name: string): Promise<AgentDTO | null> {
    return prisma.agent.findFirst({ where: { userId, name } })
  },

  async create(data: { userId: string; name: string; description?: string; systemPrompt: string }): Promise<AgentDTO> {
    return prisma.agent.create({ data })
  },

  async update(id: string, data: { name?: string; description?: string | null; systemPrompt?: string }): Promise<AgentDTO> {
    return prisma.agent.update({ where: { id }, data })
  },

  async delete(id: string): Promise<void> {
    await prisma.agent.delete({ where: { id } })
  },
}
