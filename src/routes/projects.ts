import { Hono } from 'hono'
import { projectService } from '../services'
import { createProjectSchema, updateProjectSchema } from '../types/requests'
import { success } from '../lib/utils'

const projectRoutes = new Hono()

projectRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const projects = await projectService.list(userId)
  return c.json(success(projects, { total: projects.length }))
})

projectRoutes.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = createProjectSchema.parse(body)
  const project = await projectService.create(userId, input)
  return c.json(success(project), 201)
})

projectRoutes.get('/:id', async (c) => {
  const userId = c.get('userId')
  const project = await projectService.getById(c.req.param('id'), userId)
  return c.json(success(project))
})

projectRoutes.patch('/:id', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = updateProjectSchema.parse(body)
  const project = await projectService.update(c.req.param('id'), userId, input)
  return c.json(success(project))
})

projectRoutes.delete('/:id', async (c) => {
  const userId = c.get('userId')
  await projectService.delete(c.req.param('id'), userId)
  return c.body(null, 204)
})

export default projectRoutes
