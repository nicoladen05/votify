# votify

Web app for collaborative Spotify queue voting. Guests can search tracks, add songs to a shared queue, and vote. Admins can sign in, connect Spotify, and the server worker keeps playback and queue state in sync.

## Tech stack

- SvelteKit + TypeScript + Vite
- Tailwind CSS v4
- PostgreSQL + Drizzle ORM
- Better Auth (email/password admin auth)
- Spotify Web API
- SSE for live "now playing" updates

## Features

- Search Spotify tracks and add them to a shared queue
- Guest voting with per-guest cookie identity
- Queue ranking by vote score
- Voting auto-close near track end
- Admin sign-in + Spotify account connect/disconnect
- Background worker that polls playback and schedules next queued song

## Prerequisites

- Node.js 20+
- npm
- Docker (for local PostgreSQL via `compose.yaml`)
- A Spotify app (Client ID + Client Secret)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Set required env vars in `.env`:

- `PUBLIC_SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `DATABASE_URL`
- `ORIGIN`
- `BETTER_AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

4. Start PostgreSQL:

```bash
npm run db:start
```

5. Apply database schema:

```bash
npm run db:push
```

6. Start the app:

```bash
npm run dev
```

## Development scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run db:start` - start local Postgres container
- `npm run db:push` - push schema to DB
- `npm run db:generate` - generate migrations
- `npm run db:migrate` - run migrations
- `npm run db:studio` - open Drizzle Studio


## Project structure

```text
src/
  lib/
    compenents/         # UI components (SearchBar, Queue, NowPlaying)
    server/
      db/               # Drizzle DB client + schema
      spotify/          # Spotify token logic + queue watcher worker
      auth.ts           # Better Auth setup
  routes/
    admin/              # Admin pages + Spotify connect flow
    api/                # Search, queue, votes, now-playing SSE
```
