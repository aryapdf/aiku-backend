import type { IAIProvider } from './types'
import { NineRouterProvider } from './nineRouterProvider'

const providers: Record<string, IAIProvider> = {
  'nine-router': new NineRouterProvider(),
}

/**
 * Resolve a provider by id (defaults to nine-router).
 * Add new providers to the map above as they are implemented.
 */
export function getAIProvider(id?: string | null): IAIProvider {
  const key = id ?? 'nine-router'
  return providers[key] ?? providers['nine-router']
}
