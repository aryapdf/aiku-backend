import { prisma } from '../lib/db'
import type { ReferenceFileDTO } from '../types'

export const referenceRepository = {
  async findByProjectId(projectId: string): Promise<ReferenceFileDTO[]> {
    return prisma.referenceFile.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, projectId: true, title: true, filename: true, createdAt: true, updatedAt: true },
    })
  },

  async findById(id: string) {
    return prisma.referenceFile.findUnique({ where: { id } })
  },

  async create(data: { projectId: string; userId: string; title: string; filename: string; content: string }) {
    return prisma.referenceFile.create({ data })
  },

  async update(id: string, data: { title?: string; content?: string }) {
    return prisma.referenceFile.update({ where: { id }, data })
  },

  async delete(id: string): Promise<void> {
    await prisma.referenceFile.delete({ where: { id } })
  },
}
