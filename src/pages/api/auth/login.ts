import type { APIRoute } from 'astro'
import { verifyCredentials, createSession, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const user = await verifyCredentials(email, password)

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = await createSession(user.id)

    cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return new Response(JSON.stringify({ message: 'Logged in' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Login error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
