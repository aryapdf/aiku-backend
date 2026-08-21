import { Hono } from 'hono'
import { settingsService } from '../services'
import { updateSettingsSchema } from '../types/requests'
import { success } from '../lib/utils'

const settingsRoutes = new Hono()

settingsRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const settings = await settingsService.get(userId)
  return c.json(success(settings))
})

settingsRoutes.patch('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const input = updateSettingsSchema.parse(body)
  const settings = await settingsService.update(userId, input)
  return c.json(success(settings))
})

export default settingsRoutes
