import type { APIRoute } from 'astro'
import { stripe } from '../../../lib/stripe'

/**
 * Stripe webhook handler.
 * Only active when STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!stripe) {
    return new Response(JSON.stringify({ error: 'Stripe is not configured' }), {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: 'Missing signature or webhook secret' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case 'checkout.session.completed':
        break
      case 'customer.subscription.updated':
        break
      case 'customer.subscription.deleted':
        break
      default:
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return new Response(JSON.stringify({ error: 'Webhook verification failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
