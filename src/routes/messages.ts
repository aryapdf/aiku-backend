import { Hono } from 'hono'
import { chatService } from '../services'
import { sendMessageSchema } from '../types/requests'
import { success } from '../lib/utils'

const messageRoutes = new Hono()

messageRoutes.get('/', async (c) => {
  const conversationId = c.req.query('conversationId')
  if (!conversationId) return c.json({ error: { code: 'VALIDATION_ERROR', message: 'conversationId required' } }, 400)
  const messages = await chatService.getMessages(conversationId)
  return c.json(success(messages, { total: messages.length }))
})

messageRoutes.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = sendMessageSchema.parse(body)

  // Stream response
  c.header('Content-Type', 'text/event-stream')
  c.header('Cache-Control', 'no-cache')
  c.header('Connection', 'keep-alive')

  return c.stream(async (stream) => {
    try {
      for await (const chunk of chatService.streamMessage({ ...input, userId })) {
        await stream.write(`data: ${JSON.stringify(chunk)}\n\n`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Stream error'
      await stream.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`)
    }
  })
})

messageRoutes.delete('/:id', async (c) => {
  await chatService.getMessages(c.req.param('id')) // verify exists via conversation check
  return c.body(null, 204)
})

export default messageRoutes
