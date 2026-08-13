import { config } from 'dotenv'
import { resolve } from 'path'

// Load `.env` first, then `.env.local` as an override (local is gitignored).
config({ path: resolve(import.meta.dirname, '../../', '.env') })
config({ path: resolve(import.meta.dirname, '../../', '.env.local'), override: true })

export const env = {
  PORT: parseInt(process.env.PORT || '3003', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  AUTH_SECRET: process.env.AUTH_SECRET || 'dev-secret-change-me',
  WHITELIST_EMAILS: (process.env.WHITELIST_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean),
  NINE_ROUTER_API_KEY: process.env.NINE_ROUTER_API_KEY!,
  NINE_ROUTER_BASE_URL: process.env.NINE_ROUTER_BASE_URL || 'https://api.nineai.com',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const
