import { OAuth2Client } from 'google-auth-library'
import { env } from '../config/env'
import { prisma } from '../lib/db'
import { signJwt } from '../lib/jwt'
import { hashPassword, verifyPassword } from '../lib/password'
import { projectRepository } from '../repositories'

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export interface GooglePayload {
  email: string
  name: string
  picture: string
}

function toSessionUser(user: { id: string; email: string; username: string | null; name: string | null }) {
  return {
    token: signJwt({ sub: user.id, email: user.email, name: user.name ?? user.username ?? undefined }),
    user: { id: user.id, email: user.email, username: user.username, name: user.name },
  }
}

async function ensureDefaultProject(userId: string) {
  const existing = await projectRepository.findByUserId(userId)
  if (existing.length === 0) {
    await projectRepository.create(userId, { name: 'Personal', icon: '📚' })
  }
}

// ── Username/password auth ────────────────────────────────────────────

export async function handleRegister(input: { username: string; password: string; name?: string }) {
  const username = input.username.trim().toLowerCase()
  if (!username) throw new Error('Username is required')
  if (input.password.length < 6) throw new Error('Password must be at least 6 characters')

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: `${username}@aiku.local` }] },
  })
  if (existing) throw new Error('Username already taken')

  const passwordHash = await hashPassword(input.password)
  const user = await prisma.user.create({
    data: {
      email: `${username}@aiku.local`,
      username,
      passwordHash,
      name: input.name?.trim() || username,
    },
  })

  await ensureDefaultProject(user.id)
  return toSessionUser(user)
}

export async function handleLogin(input: { username: string; password: string }) {
  const username = input.username.trim().toLowerCase()
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: username }] },
  })
  if (!user || !user.passwordHash) throw new Error('Invalid username or password')

  const valid = await verifyPassword(input.password, user.passwordHash)
  if (!valid) throw new Error('Invalid username or password')

  return toSessionUser(user)
}

// ── Google OAuth (disabled — kept for future re-enable) ───────────────

async function verifyGoogleIdToken(idToken: string): Promise<GooglePayload> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()
  if (!payload?.email) throw new Error('Google token does not contain an email address.')

  return {
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0],
    picture: payload.picture ?? '',
  }
}

function isWhitelisted(email: string) {
  if (env.WHITELIST_EMAILS.length === 0) return true
  return env.WHITELIST_EMAILS.includes(email)
}

export async function handleGoogleLogin(idToken: string) {
  const googlePayload = await verifyGoogleIdToken(idToken)
  if (!isWhitelisted(googlePayload.email)) {
    throw new Error('Email is not whitelisted.')
  }

  const existing = await prisma.user.findUnique({ where: { email: googlePayload.email } })
  const user =
    existing ??
    (await prisma.user.create({
      data: { email: googlePayload.email, name: googlePayload.name },
    }))

  await ensureDefaultProject(user.id)
  return toSessionUser(user)
}

export async function handleAnonymousLogin(_deviceId?: string) {
  throw new Error('Anonymous login is disabled')
}
