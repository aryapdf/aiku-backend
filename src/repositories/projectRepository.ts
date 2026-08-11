import { prisma } from '../lib/db'
import type { ProjectDTO } from '../types'

export const projectRepository = {
  async findByUserId(userId: string): Promise<ProjectDTO[]> {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })
  },

  async findById(id: string): Promise<ProjectDTO | null> {
    return prisma.project.findUnique({ where: { id } })
  },

  async findByName(userId: string, name: string): Promise<ProjectDTO | null> {
    return prisma.project.findFirst({ where: { userId, name } })
  },

  async create(userId: string, data: { name: string; description?: string; icon?: string }): Promise<ProjectDTO> {
    return prisma.project.create({ data: { ...data, userId } })
  },

  async update(id: string, data: { name?: string; description?: string; icon?: string }): Promise<ProjectDTO> {
    return prisma.project.update({ where: { id }, data })
  },

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } })
  },
}
