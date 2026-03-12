import type { APIRoute } from 'astro'
import { getUserFromSession, SESSION_COOKIE } from '../../../lib/auth'
import { getPrisma } from '../../../lib/prisma'

export const PATCH: APIRoute = async ({ cookies, request }) => {
  const token = cookies.get(SESSION_COOKIE)?.value
  const user = await getUserFromSession(token)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { name, email } = await request.json()
    const prisma = getPrisma()

    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return new Response(JSON.stringify({ error: 'Email already in use' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name, email },
    })

    return new Response(JSON.stringify({ message: 'Profile updated' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
