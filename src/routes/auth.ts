import { Hono } from 'hono'

const authRoutes = new Hono()

authRoutes.post('/login', (c) => {
  // Placeholder: redirect to Google OAuth
  return c.json({ data: { message: 'OAuth login initiated' } })
})

authRoutes.get('/session', (c) => {
  const userId = c.get('userId')
  const email = c.get('email')
  return c.json({
    data: {
      user: { id: userId, email, name: 'Dev User' },
      expires: new Date(Date.now() + 86400000).toISOString(),
    },
  })
})

authRoutes.post('/logout', (c) => {
  return c.json({ data: { message: 'Logged out' } })
})

export default authRoutes
