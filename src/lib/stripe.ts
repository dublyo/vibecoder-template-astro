import Stripe from 'stripe'

/** Stripe client — only initializes if STRIPE_SECRET_KEY is set */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    })
  : null
