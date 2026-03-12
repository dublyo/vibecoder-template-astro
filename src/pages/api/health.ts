import type { APIRoute } from 'astro'

/**
 * Health check endpoint — returns 200 if the app is running.
 * Used by Docker healthchecks, load balancers, and monitoring.
 */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
