import { getPrisma } from './prisma'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

const SESSION_COOKIE = 'session_token'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

/** Register a new user and return the user object */
export async function registerUser(name: string, email: string, password: string) {
  const prisma = getPrisma()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('Email already registered')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })
  return user
}

/** Verify credentials and return the user if valid */
export async function verifyCredentials(email: string, password: string) {
  const prisma = getPrisma()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  return user
}

/** Create a session for a user and return the token */
export async function createSession(userId: string): Promise<string> {
  const prisma = getPrisma()
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  await prisma.session.create({
    data: { sessionToken: token, userId, expires },
  })

  return token
}

/** Get the user from a session token */
export async function getUserFromSession(token: string | undefined) {
  if (!token) return null
  const prisma = getPrisma()

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  })

  if (!session || session.expires < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    return null
  }

  return session.user
}

/** Delete a session by token */
export async function deleteSession(token: string) {
  const prisma = getPrisma()
  await prisma.session.deleteMany({ where: { sessionToken: token } })
}

export { SESSION_COOKIE, SESSION_MAX_AGE }
