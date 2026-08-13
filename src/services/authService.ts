import { OAuth2Client } from 'google-auth-library'
import { env } from '../config/env'
import { prisma } from '../lib/db'
import { signJwt } from '../lib/jwt'

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export interface GooglePayload {
  email: string
  name: string
  picture: string
}

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

async function findOrCreateUser(email: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return existing

  return prisma.user.create({
    data: { email, name },
  })
}

export async function handleGoogleLogin(idToken: string) {
  const googlePayload = await verifyGoogleIdToken(idToken)
  if (!isWhitelisted(googlePayload.email)) {
    throw new Error('Email is not whitelisted.')
  }

  const user = await findOrCreateUser(googlePayload.email, googlePayload.name)

  const token = signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
  })

  return { token, user }
}
