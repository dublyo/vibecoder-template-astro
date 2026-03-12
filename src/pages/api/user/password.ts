import type { APIRoute } from 'astro'
import { getUserFromSession, SESSION_COOKIE } from '../../../lib/auth'
import { getPrisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

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
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const prisma = getPrisma()
    const fullUser = await prisma.user.findUnique({ where: { id: user.id } })

    if (!fullUser?.password) {
      return new Response(JSON.stringify({ error: 'No password set' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const isValid = await bcrypt.compare(currentPassword, fullUser.password)
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return new Response(JSON.stringify({ message: 'Password updated' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Password update error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
