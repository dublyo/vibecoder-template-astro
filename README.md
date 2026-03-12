# VibeCoder Template -- Astro

A production-ready, full-stack Astro starter template from **[VibeCoder](https://vibecode.new)** -- the AI vibe-coding platform. Ship authenticated, payments-enabled web apps in minutes with server-side rendering, React islands for interactivity, and a clean purple design system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 (SSR, `output: 'server'`) |
| UI Islands | React 19 (`client:load` hydration) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Database | PostgreSQL 17 + Prisma 7 ORM |
| Cache | Redis 7.4 (via ioredis) |
| Auth | Custom cookie-based sessions (bcryptjs) |
| Payments | Stripe (webhook-ready) |
| Email | Resend |
| Validation | Zod 4 |
| Toasts | sonner |
| Icons | lucide-react |
| Font | DM Sans (Google Fonts) |
| Adapter | `@astrojs/node` standalone |

---

## Features

- **Authentication** -- Login, register, forgot-password, and reset-password flows built as React islands with cookie-based sessions
- **Dashboard** -- Protected dashboard layout with a collapsible sidebar
- **User Settings** -- Profile editing and password change pages
- **Stripe Payments** -- Webhook endpoint at `/api/stripe/webhook`, ready to handle checkout events
- **Email via Resend** -- Transactional email support for password resets and notifications
- **Health Check API** -- `GET /api/health` for uptime monitoring and container orchestration
- **Dark / Light Mode** -- `localStorage`-based theme toggle, no flash of unstyled content
- **Custom 404 Page** -- Branded error page matching the design system
- **Database Seed Script** -- `npx prisma db seed` populates dev data
- **Docker + Docker Compose** -- Multi-stage Dockerfile and full Compose stack (app, Postgres, Redis)
- **GitHub Actions CI/CD** -- Build, test, and publish container images to GHCR
- **Design System** -- Shuffle-inspired purple (`#382CDD`) palette with DM Sans typography

---

## Quick Start

### Prerequisites

- Node.js 22+
- Docker and Docker Compose (for Postgres and Redis)

### 1. Clone and install

```bash
git clone https://github.com/dublyo/vibecoder-template-astro.git my-app
cd my-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values (see the Environment Variables section below).

### 3. Start Postgres and Redis

```bash
docker compose up postgres redis -d
```

### 4. Set up the database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Alternative: Full Docker workflow

To run everything in containers (app + Postgres + Redis):

```bash
docker compose up
```

---

## Project Structure

```
src/
  components/
    layout/
      Header.astro          # Site header with nav
      Footer.astro          # Site footer
    ui/
      LoginForm.tsx          # React island -- login
      RegisterForm.tsx       # React island -- registration
      ForgotPasswordForm.tsx # React island -- forgot password
      ResetPasswordForm.tsx  # React island -- reset password
      SettingsForm.tsx       # React island -- user settings
      ThemeToggle.tsx        # React island -- dark/light switch
      ToastProvider.tsx      # React island -- sonner toast container
  layouts/
    Base.astro               # Root HTML layout (head, fonts, theme script)
    Dashboard.astro          # Authenticated layout with sidebar
  lib/
    auth.ts                  # Session helpers (create, validate, destroy)
    config.ts                # Centralized env var access with defaults
    prisma.ts                # Prisma client singleton
    redis.ts                 # ioredis client singleton
    resend.ts                # Resend email client
    stripe.ts                # Stripe client
    formatters.ts            # Date/currency formatting utilities
    utils.ts                 # General helpers (cn, clsx + tailwind-merge)
  pages/
    index.astro              # Landing page
    login.astro              # Login page
    register.astro           # Register page
    forgot-password.astro    # Forgot password page
    reset-password.astro     # Reset password page
    dashboard.astro          # Dashboard home (protected)
    dashboard/
      settings.astro         # User settings (protected)
    404.astro                # Custom not-found page
    api/
      health.ts              # GET /api/health
      auth/
        login.ts             # POST /api/auth/login
        register.ts          # POST /api/auth/register
        logout.ts            # POST /api/auth/logout
        forgot-password.ts   # POST /api/auth/forgot-password
        reset-password.ts    # POST /api/auth/reset-password
      user/
        me.ts                # GET /api/user/me
        profile.ts           # PATCH /api/user/profile
        password.ts          # PATCH /api/user/password
      stripe/
        webhook.ts           # POST /api/stripe/webhook
  styles/
    global.css               # Tailwind directives and custom properties
prisma/
  schema.prisma              # Database schema (User, Account, Session, tokens)
  seed.ts                    # Seed script
  prisma.config.ts           # Prisma config
```

---

## React Islands Architecture

Astro renders all pages as static HTML on the server by default. Interactive components -- forms, theme toggle, toast notifications -- are React components hydrated on the client using the `client:load` directive.

```astro
---
import LoginForm from '../components/ui/LoginForm.tsx'
---
<LoginForm client:load />
```

This keeps the JavaScript bundle small: only the components that need interactivity ship client-side code. Everything else is zero-JS server-rendered HTML.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://vibecoder:vibecoder@localhost:5432/app` | PostgreSQL connection string |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis connection string |
| `AUTH_SECRET` | Yes | -- | Secret key for signing session cookies |
| `APP_URL` | No | `http://localhost:3000` | Public-facing app URL |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `STRIPE_SECRET_KEY` | No | -- | Stripe secret key (opt-in) |
| `STRIPE_WEBHOOK_SECRET` | No | -- | Stripe webhook signing secret (opt-in) |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | -- | Stripe publishable key (opt-in) |
| `RESEND_API_KEY` | No | -- | Resend API key for transactional email (opt-in) |
| `UPLOADTHING_TOKEN` | No | -- | UploadThing token for file uploads (opt-in) |

The app starts and runs without Stripe, Resend, or UploadThing keys. Those integrations activate automatically when their keys are provided.

---

## Deployment

### Docker (recommended)

The included multi-stage Dockerfile produces a slim production image based on `node:22-bookworm-slim`:

```bash
docker build -t my-app .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_URL="redis://..." \
  -e AUTH_SECRET="your-secret" \
  my-app
```

The container entrypoint runs `prisma db push` before starting the Node server, so the database schema is always up to date on deploy.

### Manual

```bash
npm run build
node dist/server/entry.mjs
```

The build uses the `@astrojs/node` adapter in standalone mode. The output at `dist/server/entry.mjs` is a self-contained Node.js HTTP server that listens on port 3000.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma db seed` | Run the seed script |
| `npx prisma studio` | Open Prisma Studio GUI |

---

## License

MIT

---

Built with [VibeCoder](https://vibecode.new)
