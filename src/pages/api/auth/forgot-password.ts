import type { APIRoute } from 'astro'
import { getPrisma } from '../../../lib/prisma'
import { resend } from '../../../lib/resend'
import crypto from 'node:crypto'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'If an account exists, a reset link has been sent.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await prisma.passwordResetToken.deleteMany({ where: { email } })

    const token = crypto.randomBytes(32).toString('hex')
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 3600 * 1000),
      },
    })

    const appUrl = process.env.PUBLIC_APP_URL || 'http://localhost:4321'
    const resetUrl = `${appUrl}/reset-password?token=${token}`

    if (resend) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
      })
    } else {
      console.log(`[Dev] Password reset link: ${resetUrl}`)
    }

    return new Response(
      JSON.stringify({ message: 'If an account exists, a reset link has been sent.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
