import { referenceRepository } from '../repositories'
import type { CreateReferenceInput, UpdateReferenceInput } from '../types'

export const referenceService = {
  async list(projectId: string) {
    return referenceRepository.findByProjectId(projectId)
  },

  async getById(id: string) {
    const ref = await referenceRepository.findById(id)
    if (!ref) throw new Error('Reference file not found')
    return ref
  },

  async create(input: CreateReferenceInput & { userId: string }) {
    return referenceRepository.create(input)
  },

  async update(id: string, input: UpdateReferenceInput) {
    const ref = await referenceRepository.findById(id)
    if (!ref) throw new Error('Reference file not found')
    return referenceRepository.update(id, input)
  },

  async delete(id: string) {
    const ref = await referenceRepository.findById(id)
    if (!ref) throw new Error('Reference file not found')
    await referenceRepository.delete(id)
  },
}
