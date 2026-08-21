import { Hono } from 'hono'
import { handleGoogleLogin, handleAnonymousLogin, handleRegister, handleLogin } from '../services/authService'
import { success, errorResponse } from '../lib/utils'

const authRoutes = new Hono()

authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json<{ username?: string; password?: string; name?: string }>()
    if (!body.username || !body.password) {
      return c.json(errorResponse('BAD_REQUEST', 'username and password are required'), 400)
    }
    const { token, user } = await handleRegister({ username: body.username, password: body.password, name: body.name })
    return c.json(success({ token, user }), 201)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    return c.json(errorResponse('BAD_REQUEST', message), 400)
  }
})

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json<{ username?: string; password?: string }>()
    if (!body.username || !body.password) {
      return c.json(errorResponse('BAD_REQUEST', 'username and password are required'), 400)
    }
    const { token, user } = await handleLogin({ username: body.username, password: body.password })
    return c.json(success({ token, user }))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return c.json(errorResponse('UNAUTHORIZED', message), 401)
  }
})

// Google OAuth — currently disabled on the frontend but kept functional.
authRoutes.post('/google', async (c) => {
  try {
    const body = await c.req.json<{ idToken?: string }>()
    if (!body.idToken) {
      return c.json(errorResponse('BAD_REQUEST', 'idToken is required'), 400)
    }

    const { token, user } = await handleGoogleLogin(body.idToken)
    return c.json(success({ token, user }))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return c.json(errorResponse('UNAUTHORIZED', message), 401)
  }
})

authRoutes.post('/anonymous', async (c) => {
  try {
    const body = await c.req.json<{ deviceId?: string }>()
    const { token, user } = await handleAnonymousLogin(body.deviceId)
    return c.json(success({ token, user }))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Anonymous login failed'
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
