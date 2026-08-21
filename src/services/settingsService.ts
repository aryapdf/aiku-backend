import { settingsRepository } from '../repositories'

export interface UpdateSettingsInput {
  defaultModel?: string
  theme?: string
  defaultProvider?: string
  customSystemPrompt?: string | null
  nineRouterBaseUrl?: string | null
  nineRouterApiKey?: string | null
}

export const settingsService = {
  async get(userId: string) {
    return settingsRepository.findByUserId(userId)
  },

  async update(userId: string, input: UpdateSettingsInput) {
    return settingsRepository.update(userId, input)
  },
}
