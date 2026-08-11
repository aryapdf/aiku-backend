import { Hono } from 'hono'
import { referenceService } from '../services'
import { createReferenceSchema, updateReferenceSchema } from '../types/requests'
import { success } from '../lib/utils'

const referenceRoutes = new Hono()

referenceRoutes.get('/', async (c) => {
  const projectId = c.req.query('projectId')
  if (!projectId) return c.json({ error: { code: 'VALIDATION_ERROR', message: 'projectId required' } }, 400)
  const files = await referenceService.list(projectId)
  return c.json(success(files, { total: files.length }))
})

referenceRoutes.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = createReferenceSchema.parse(body)
  const file = await referenceService.create({ ...input, userId })
  return c.json(success(file), 201)
})

referenceRoutes.get('/:id', async (c) => {
  const file = await referenceService.getById(c.req.param('id'))
  return c.json(success(file))
})

referenceRoutes.patch('/:id', async (c) => {
  const body = await c.req.json()
  const input = updateReferenceSchema.parse(body)
  const file = await referenceService.update(c.req.param('id'), input)
  return c.json(success(file))
})

referenceRoutes.delete('/:id', async (c) => {
  await referenceService.delete(c.req.param('id'))
  return c.body(null, 204)
})

export default referenceRoutes
