import type { APIRoute } from 'astro'
import { registerUser } from '../../../lib/auth'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await registerUser(name, email, password)

    return new Response(JSON.stringify({ message: 'Account created' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed'
    return new Response(JSON.stringify({ error: message }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
