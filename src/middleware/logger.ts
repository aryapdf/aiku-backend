import type { Context, Next } from 'hono'
import { env } from '../config/env'

export async function logger(c: Context, next: Next) {
  const start = Date.now()
  await next()
  const ms = Date.now() - start

  if (env.LOG_LEVEL === 'debug') {
    console.log(`[${c.req.method}] ${c.req.url} → ${c.res.status} (${ms}ms)`)
  }
}
