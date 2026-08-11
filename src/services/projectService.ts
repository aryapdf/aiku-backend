import { projectRepository } from '../repositories'
import type { CreateProjectInput, UpdateProjectInput, ProjectDTO } from '../types'

export const projectService = {
  async list(userId: string): Promise<ProjectDTO[]> {
    return projectRepository.findByUserId(userId)
  },

  async getById(id: string, userId: string): Promise<ProjectDTO> {
    const project = await projectRepository.findById(id)
    if (!project) throw new Error('Project not found')
    if (project.userId !== userId) throw new Error('Access denied')
    return project
  },

  async create(userId: string, input: CreateProjectInput): Promise<ProjectDTO> {
    const existing = await projectRepository.findByName(userId, input.name)
    if (existing) throw new Error('Project name already exists')
    return projectRepository.create(userId, input)
  },

  async update(id: string, userId: string, input: UpdateProjectInput): Promise<ProjectDTO> {
    const project = await projectRepository.findById(id)
    if (!project) throw new Error('Project not found')
    if (project.userId !== userId) throw new Error('Access denied')

    if (input.name) {
      const dup = await projectRepository.findByName(userId, input.name)
      if (dup && dup.id !== id) throw new Error('Project name already exists')
    }

    return projectRepository.update(id, input)
  },

  async delete(id: string, userId: string): Promise<void> {
    const project = await projectRepository.findById(id)
    if (!project) throw new Error('Project not found')
    if (project.userId !== userId) throw new Error('Access denied')
    await projectRepository.delete(id)
  },
}
