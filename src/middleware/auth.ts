import type { Context, Next } from 'hono'
import { env } from '../config/env'
import { errorResponse } from '../lib/utils'

const TOKEN_PREFIX = 'Bearer '

// Dev mode: skip auth if WHITELIST_EMAILS is empty
const DEV_USER = { id: 'dev-user', email: 'dev@aiku.local' }

export async function authMiddleware(c: Context, next: Next) {
  if (env.NODE_ENV === 'development' && env.WHITELIST_EMAILS.length === 0) {
    c.set('userId', DEV_USER.id)
    c.set('email', DEV_USER.email)
    return next()
  }

  const header = c.req.header('Authorization')
  if (!header?.startsWith(TOKEN_PREFIX)) {
    return c.json(errorResponse('UNAUTHORIZED', 'Missing or invalid token'), 401)
  }

  const token = header.slice(TOKEN_PREFIX.length)
  try {
    // JWT verify would go here in production
    c.set('userId', 'user-from-token')
    c.set('email', 'user@email.com')
  } catch {
    return c.json(errorResponse('UNAUTHORIZED', 'Invalid token'), 401)
  }

  return next()
}
