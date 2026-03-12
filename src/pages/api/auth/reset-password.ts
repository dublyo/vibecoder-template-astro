import type { APIRoute } from 'astro'
import { getPrisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token, password } = await request.json()

    if (!token || !password || password.length < 8) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const prisma = getPrisma()

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return new Response(JSON.stringify({ error: 'Invalid or expired reset token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })

    return new Response(JSON.stringify({ message: 'Password has been reset' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
