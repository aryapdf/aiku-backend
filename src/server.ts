import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'
import { env } from './config/env'

import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import conversationRoutes from './routes/conversations'
import messageRoutes from './routes/messages'
import referenceRoutes from './routes/reference'
import modelRoutes from './routes/models'

const app = new Hono()

// Global middleware
app.use('*', cors({ origin: ['http://localhost:5173'], credentials: true }))
app.use('*', logger())

// Public routes
app.route('/api/auth', authRoutes)

// Protected routes
const api = new Hono()
api.use('*', authMiddleware)
api.route('/projects', projectRoutes)
api.route('/conversations', conversationRoutes)
api.route('/messages', messageRoutes)
api.route('/reference', referenceRoutes)
api.route('/models', modelRoutes)

app.route('/api', api)

// Error handler
app.onError(errorHandler)

console.log(`🚀 AIKU API starting on http://localhost:${env.PORT}`)

export default {
  port: env.PORT,
  fetch: app.fetch,
}
