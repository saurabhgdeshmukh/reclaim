# Reclaim

A paperwork-to-money agent. Phase 0 is the skeleton: a Next.js desk, a Fastify API, and shared packages. The first product is trucking detention, hours a dock kept a truck waiting.

This repo is separate from Trackly. Trackly stays the project tracker on the personal GitHub account.

## Run it

```bash
pnpm install
pnpm dev
```

- Dashboard: http://localhost:3000
- API: http://localhost:4000/health

With no Supabase keys, sign in on the dashboard with any email and a password of at least 8 characters. That session is a local cookie. It is turned off in production.

## Real login

1. Create a free project at https://supabase.com.
2. Copy `.env.example` to `apps/dashboard/.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. In Supabase, turn off email confirmation while you are developing, or use the confirm link, which returns to `/auth/confirm`.

## Layout

```text
apps/dashboard   Next.js desk
apps/api         Fastify health and hello
packages/api-contracts
packages/db      organizations and memberships
packages/logging
packages/retry
```
