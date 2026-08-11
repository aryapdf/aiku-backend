export interface ProjectDTO {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ConversationDTO {
  id: string
  projectId: string
  title: string
  model: string
  messageCount?: number
  lastMessageAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface MessageDTO {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface ReferenceFileDTO {
  id: string
  projectId: string
  title: string
  filename: string
  content?: string
  createdAt: Date
  updatedAt: Date
}
