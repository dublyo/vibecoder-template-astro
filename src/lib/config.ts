/**
 * Centralized configuration — all env vars accessed through this file.
 * This prevents scattered process.env calls and provides type safety.
 */

function getEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback
}

export const config = {
  /** Application */
  appUrl: getEnv('APP_URL', 'http://localhost:3000'),
  isProduction: process.env.NODE_ENV === 'production',

  /** Database */
  databaseUrl: getEnv('DATABASE_URL', 'postgresql://vibecoder:vibecoder@localhost:5432/app'),

  /** Redis */
  redisUrl: getEnv('REDIS_URL', 'redis://localhost:6379'),

  /** Auth */
  authSecret: getEnv('AUTH_SECRET'),

  /** Stripe (optional) */
  stripe: {
    secretKey: getEnv('STRIPE_SECRET_KEY'),
    webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET'),
    publishableKey: getEnv('PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    get isConfigured() {
      return !!this.secretKey
    },
  },

  /** Resend (optional) */
  resend: {
    apiKey: getEnv('RESEND_API_KEY'),
    get isConfigured() {
      return !!this.apiKey
    },
  },

  /** UploadThing (optional) */
  uploadthing: {
    token: getEnv('UPLOADTHING_TOKEN'),
    get isConfigured() {
      return !!this.token
    },
  },
} as const
