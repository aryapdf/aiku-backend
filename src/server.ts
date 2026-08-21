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
import settingsRoutes from './routes/settings'
import openapiSpec from './openapi.json' with { type: 'json' }

const app = new Hono()

// Global middleware
app.use('*', cors({
  origin: ['http://localhost:4321', 'http://localhost:5173'],
  credentials: true,
}))
app.use('*', logger())

// Public routes
app.route('/api/auth', authRoutes)

// OpenAPI spec
app.get('/api/openapi.json', (c) => c.json(openapiSpec))

// Swagger UI
app.get('/api/docs', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AIKU API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    SwaggerUIBundle({ url: '/api/openapi.json', dom_id: '#swagger-ui' })
  </script>
</body>
</html>`)
})

// Protected routes
const api = new Hono()
api.use('*', authMiddleware)
api.route('/projects', projectRoutes)
api.route('/conversations', conversationRoutes)
api.route('/messages', messageRoutes)
api.route('/reference', referenceRoutes)
api.route('/models', modelRoutes)
api.route('/settings', settingsRoutes)

app.route('/api', api)

// Error handler
app.onError(errorHandler)

import { serve } from '@hono/node-server'

console.log(`🚀 AIKU API starting on http://localhost:${env.PORT}`)

serve({ fetch: app.fetch, port: env.PORT })
