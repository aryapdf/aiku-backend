import type { Context, Next } from 'hono'
import { ZodError } from 'zod'
import { errorResponse } from '../lib/utils'

export async function errorHandler(err: Error, c: Context) {
  if (err instanceof ZodError) {
    return c.json(
      errorResponse('VALIDATION_ERROR', 'Invalid input', err.errors),
      422,
    )
  }

  if (err.message.includes('not found')) {
    return c.json(errorResponse('NOT_FOUND', err.message), 404)
  }

  if (err.message.includes('already exists') || err.message.includes('duplicate')) {
    return c.json(errorResponse('CONFLICT', err.message), 409)
  }

  console.error('[error]', err.message)
  return c.json(errorResponse('INTERNAL_ERROR', 'Internal server error'), 500)
}
