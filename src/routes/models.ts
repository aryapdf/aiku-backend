import { Hono } from 'hono'
import { modelService, agentService } from '../services'
import { createModelSchema, updateModelSchema, testModelSchema, createAgentSchema, updateAgentSchema } from '../types/requests'
import { success } from '../lib/utils'

const modelRoutes = new Hono()

// ── AI Models (user-defined, persisted) ──────────────────────────────

modelRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const models = await modelService.list(userId)
  return c.json(success(models))
})

modelRoutes.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = createModelSchema.parse(body)
  const model = await modelService.create(userId, input)
  return c.json(success(model), 201)
})

modelRoutes.post('/test', async (c) => {
  const body = await c.req.json()
  const input = testModelSchema.parse(body)

  c.header('Content-Type', 'text/event-stream')
  c.header('Cache-Control', 'no-cache')
  c.header('Connection', 'keep-alive')

  return c.stream(async (stream) => {
    try {
      for await (const delta of modelService.test(input)) {
        await stream.write(`data: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text: delta } })}\n\n`)
      }
      await stream.write(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Test failed'
      await stream.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`)
    }
  })
})

// ── Agents (user-defined, persisted) ─────────────────────────────────
// Registered before /:id so the literal /agents segment is not shadowed.

modelRoutes.get('/agents', async (c) => {
  const userId = c.get('userId')
  const agents = await agentService.list(userId)
  return c.json(success(agents))
})

modelRoutes.post('/agents', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = createAgentSchema.parse(body)
  const agent = await agentService.create(userId, input)
  return c.json(success(agent), 201)
})

modelRoutes.get('/agents/:id', async (c) => {
  const userId = c.get('userId')
  const agent = await agentService.getById(c.req.param('id'), userId)
  return c.json(success(agent))
})

modelRoutes.patch('/agents/:id', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = updateAgentSchema.parse(body)
  const agent = await agentService.update(c.req.param('id'), userId, input)
  return c.json(success(agent))
})

modelRoutes.delete('/agents/:id', async (c) => {
  const userId = c.get('userId')
  await agentService.delete(c.req.param('id'), userId)
  return c.body(null, 204)
})

// ── Single model ─────────────────────────────────────────────────────

modelRoutes.get('/:id', async (c) => {
  const userId = c.get('userId')
  const model = await modelService.getById(c.req.param('id'), userId)
  return c.json(success(model))
})

modelRoutes.patch('/:id', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = updateModelSchema.parse(body)
  const model = await modelService.update(c.req.param('id'), userId, input)
  return c.json(success(model))
})

modelRoutes.delete('/:id', async (c) => {
  const userId = c.get('userId')
  await modelService.delete(c.req.param('id'), userId)
  return c.body(null, 204)
})

export default modelRoutes
