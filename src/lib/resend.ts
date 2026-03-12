import { Resend } from 'resend'

/** Resend email client — only initializes if RESEND_API_KEY is set */
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null
