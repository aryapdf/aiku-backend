import { prisma } from '../lib/db'
import type { SettingsDTO } from '../types'

const DEFAULT_SETTINGS = {
  defaultModel: 'gpt-5',
  theme: 'dark',
  defaultProvider: 'nine-router',
  customSystemPrompt: null as string | null,
  nineRouterBaseUrl: null as string | null,
  nineRouterApiKey: null as string | null,
}

export const settingsRepository = {
  async findByUserId(userId: string): Promise<SettingsDTO> {
    return prisma.settings.upsert({
      where: { userId },
      create: { userId },
      update: {},
    })
  },

  async update(userId: string, data: Partial<typeof DEFAULT_SETTINGS>): Promise<SettingsDTO> {
    return prisma.settings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    })
  },
}
