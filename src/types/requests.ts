import { z } from 'zod'
import { LIMITS, AI_MODELS } from '../config/constants'

export const createProjectSchema = z.object({
  name: z.string().min(1).max(LIMITS.PROJECT_NAME_MAX),
  description: z.string().max(LIMITS.PROJECT_DESC_MAX).optional(),
  icon: z.string().max(10).optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(LIMITS.PROJECT_NAME_MAX).optional(),
  description: z.string().max(LIMITS.PROJECT_DESC_MAX).optional(),
  icon: z.string().max(10).optional(),
})

export const createConversationSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1).max(255).optional(),
  model: z.enum(AI_MODELS).optional(),
})

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  model: z.enum(AI_MODELS).optional(),
})

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(LIMITS.MESSAGE_CONTENT_MAX),
  model: z.enum(AI_MODELS).optional(),
})

export const createReferenceSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1).max(LIMITS.REFERENCE_TITLE_MAX),
  filename: z.string().min(1),
  content: z.string().min(1),
})

export const updateReferenceSchema = z.object({
  title: z.string().min(1).max(LIMITS.REFERENCE_TITLE_MAX).optional(),
  content: z.string().min(1).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateConversationInput = z.infer<typeof createConversationSchema>
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type CreateReferenceInput = z.infer<typeof createReferenceSchema>
export type UpdateReferenceInput = z.infer<typeof updateReferenceSchema>
