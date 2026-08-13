import type { Context, Next } from 'hono'
import { env } from '../config/env'
import { errorResponse } from '../lib/utils'
import { verifyJwt } from '../lib/jwt'

const TOKEN_PREFIX = 'Bearer '

export async function authMiddleware(c: Context, next: Next) {
  // Dev mode: skip auth if WHITELIST_EMAILS is empty
  if (env.NODE_ENV === 'development' && env.WHITELIST_EMAILS.length === 0) {
    c.set('userId', 'dev-user')
    c.set('email', 'dev@aiku.local')
    c.set('name', 'Dev User')
    return next()
  }

  const header = c.req.header('Authorization')
  if (!header?.startsWith(TOKEN_PREFIX)) {
    return c.json(errorResponse('UNAUTHORIZED', 'Missing or invalid token'), 401)
  }

  const token = header.slice(TOKEN_PREFIX.length)
  try {
    const payload = verifyJwt(token)
    c.set('userId', payload.sub)
    c.set('email', payload.email)
    c.set('name', payload.name ?? '')
  } catch {
    return c.json(errorResponse('UNAUTHORIZED', 'Invalid or expired token'), 401)
  }

  return next()
}
