/**
 * Formatting utilities for dates, numbers, and currency.
 * Centralizes Intl usage for consistent display across the app.
 */

/** Format a date as "Jan 15, 2026" */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

/** Format a date as "Jan 15, 2026, 3:45 PM" */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

/** Format a number with commas: 1234567 → "1,234,567" */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/** Format as currency: 29.99 → "$29.99" */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/** Relative time: "2 hours ago", "in 3 days" */
export function formatRelativeTime(date: Date | string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diffSeconds = Math.round((then - now) / 1000)

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ]

  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit)
    }
  }

  return rtf.format(0, 'second')
}
