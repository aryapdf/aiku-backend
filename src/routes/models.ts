import { Hono } from 'hono'
import { success } from '../lib/utils'
import { AI_MODELS } from '../config/constants'

const modelRoutes = new Hono()

modelRoutes.get('/', (c) => {
  return c.json(success(AI_MODELS))
})

export default modelRoutes
