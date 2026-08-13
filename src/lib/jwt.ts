import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtPayload {
  sub: string
  email: string
  name?: string
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, env.AUTH_SECRET, { expiresIn: '7d' })
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, env.AUTH_SECRET) as JwtPayload
}
