import type { APIRoute } from 'astro'
import { getUserFromSession, SESSION_COOKIE } from '../../../lib/auth'

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value
  const user = await getUserFromSession(token)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({ name: user.name, email: user.email, role: user.role }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
