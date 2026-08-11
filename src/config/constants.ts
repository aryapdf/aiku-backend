export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

export const LIMITS = {
  PROJECT_NAME_MAX: 100,
  PROJECT_DESC_MAX: 500,
  MESSAGE_CONTENT_MAX: 4000,
  REFERENCE_FILE_MAX_MB: 10,
  REFERENCE_TITLE_MAX: 255,
} as const

export const AI_MODELS = ['gpt-5', 'claude-opus', 'gemini'] as const
export type AIModel = typeof AI_MODELS[number]
