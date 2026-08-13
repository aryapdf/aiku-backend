import { Hono } from 'hono'
import { handleGoogleLogin } from '../services/authService'
import { success, errorResponse } from '../lib/utils'

const authRoutes = new Hono()

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json<{ idToken?: string }>()
    if (!body.idToken) {
      return c.json(errorResponse('BAD_REQUEST', 'idToken is required'), 400)
    }

    const { token, user } = await handleGoogleLogin(body.idToken)

    return c.json(
      success({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      }),
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return c.json(errorResponse('UNAUTHORIZED', message), 401)
  }
})

authRoutes.get('/session', (c) => {
  const userId = c.get('userId')
  const email = c.get('email')
  const name = c.get('name') ?? 'User'

  return c.json(
    success({
      user: { id: userId, email, name },
      expires: new Date(Date.now() + 7 * 86400000).toISOString(),
    }),
  )
})

authRoutes.post('/logout', (c) => {
  return c.json(success({ message: 'Logged out' }))
})

export default authRoutes
