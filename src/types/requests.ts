import { z } from 'zod'
import { LIMITS } from '../config/constants'

// Model & agent ids are DB cuid strings; validate shape only (existence
// is checked in the service layer against the authenticated user's records).
const idSchema = z.string().min(1)
const modelSchema = idSchema.optional()
const agentSchema = idSchema.optional()

export const createModelSchema = z.object({
  name: z.string().min(1).max(255),
  provider: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(255),
  baseUrl: z.string().max(2000).optional(),
  apiKey: z.string().max(2000).optional(),
})

export const updateModelSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  provider: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(255).optional(),
  baseUrl: z.string().max(2000).nullish(),
  apiKey: z.string().max(2000).nullish(),
})

export const testModelSchema = z.object({
  provider: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(255),
  baseUrl: z.string().max(2000).optional(),
  apiKey: z.string().max(2000).optional(),
  message: z.string().max(2000).optional(),
})

export const createAgentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  systemPrompt: z.string().min(1),
})

export const updateAgentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).nullish(),
  systemPrompt: z.string().min(1).optional(),
})

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
  model: modelSchema,
  agentId: agentSchema,
})

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  model: modelSchema,
  agentId: agentSchema,
})

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(LIMITS.MESSAGE_CONTENT_MAX),
  model: modelSchema,
  agentId: agentSchema,
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
export type CreateModelInput = z.infer<typeof createModelSchema>
export type UpdateModelInput = z.infer<typeof updateModelSchema>
export type TestModelInput = z.infer<typeof testModelSchema>
export type CreateAgentInput = z.infer<typeof createAgentSchema>
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>
