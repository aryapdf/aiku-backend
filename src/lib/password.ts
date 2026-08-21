import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(_scrypt)
const KEY_LENGTH = 64

/** Hash a plaintext password into `salt:hash` (hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

/** Constant-time comparison of a plaintext password against a stored hash. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer
  const expected = Buffer.from(hash, 'hex')
  if (derived.length !== expected.length) return false
  return timingSafeEqual(derived, expected)
}
