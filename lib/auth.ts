import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from './db'

const SESSION_SECRET = process.env.SESSION_SECRET || 'craftisland-super-secret-session-key-32bytes'
const KEY = crypto.scryptSync(SESSION_SECRET, 'salt', 32)

// Native password hashing using PBKDF2
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

// Verify entered password against stored salt and hash
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':')
    if (!salt || !hash) return false
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return hash === verifyHash
  } catch (e) {
    return false
  }
}

// Secure AES-256 session token encryption
export function encryptSession(payload: any): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv)
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

// Secure AES-256 session token decryption
export function decryptSession(token: string): any {
  try {
    const [ivHex, encryptedHex] = token.split(':')
    if (!ivHex || !encryptedHex) return null
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv)
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  } catch (e) {
    return null
  }
}

// Get safe active user session from HTTP cookies
export async function getSessionUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('vw_session')
    if (!sessionCookie || !sessionCookie.value) return null
    
    const payload = decryptSession(sessionCookie.value)
    if (!payload || !payload.id) return null
    
    // Expiration check (e.g. 7 days token age check)
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    })
    
    if (!user) return null
    
    const { password, ...safeUser } = user
    return safeUser
  } catch (e) {
    return null
  }
}
