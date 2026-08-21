import { Hono } from 'hono'
import { conversationService } from '../services'
import { createConversationSchema, updateConversationSchema } from '../types/requests'
import { success } from '../lib/utils'

const conversationRoutes = new Hono()

conversationRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const projectId = c.req.query('projectId')
  const conversations = await conversationService.list(userId, projectId)
  return c.json(success(conversations, { total: conversations.length }))
})

conversationRoutes.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = createConversationSchema.parse(body)
  const conversation = await conversationService.create({ ...input, userId })
  return c.json(success(conversation), 201)
})

conversationRoutes.get('/:id', async (c) => {
  const conversation = await conversationService.getById(c.req.param('id'))
  return c.json(success(conversation))
})

conversationRoutes.patch('/:id', async (c) => {
  const body = await c.req.json()
  const input = updateConversationSchema.parse(body)
  const conversation = await conversationService.update(c.req.param('id'), input)
  return c.json(success(conversation))
})

conversationRoutes.delete('/:id', async (c) => {
  await conversationService.delete(c.req.param('id'))
  return c.body(null, 204)
})

export default conversationRoutes
