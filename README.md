# Knoxit

Production-oriented Knoxit web setup generated from `Plan.txt`, the approved single-file visual prototype, the user journey map, and `Knoxit_Complete_Package.zip`.

## Local setup

```bash
npm install
npm run db:migrate
npm run dev:api
```

In a second terminal:

```bash
npm run dev
```

Copy `.env.example` to `.env` first and replace `DATABASE_URL` with the pooled
connection string from your Neon project. The web app runs on
`http://localhost:5173`; Express runs on `http://localhost:4000`.

Authentication is first-party email/password authentication. Passwords are
scrypt-hashed, and opaque server-side sessions are sent through an HttpOnly,
SameSite cookie. Set `APP_ORIGIN` to the exact web origin in each environment.

## Validate

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run typecheck:server` validates the Express/Drizzle backend separately.

## Deployment shape

Keep the frontend and backend in this repository. `src/` is the Vite web app,
`server/` is the Express API, and `lib/` contains shared database/API contracts.
They can still be deployed as two services from the same repository.

The current `vercel.json` deploys only the Vite frontend. Deploy `server/` to a
Node-compatible service, set its `DATABASE_URL` to Neon, and set
`VITE_API_BASE_URL` to that API origin when building the frontend.
For cookie authentication, expose both services through the same site (for
example `app.knoxit.com` and `api.knoxit.com`) or reverse-proxy `/api` through
the frontend domain.

### Render backend

`render.yaml` defines a Singapore-region `knoxit-api` web service. In Render,
create a Blueprint from this repository and provide:

- `DATABASE_URL`: the pooled Neon connection string
- `APP_ORIGIN`: the exact Vercel frontend URL, with no trailing slash

The Blueprint starts on Render's free instance for testing. Free instances
sleep after inactivity, so upgrade the service before production. The free
configuration runs pending Drizzle migrations during startup; after upgrading,
move `npm run db:migrate` to Render's Pre-Deploy Command and change the Start
Command to `npm run start:api`.

While frontend and API use `vercel.app` and `onrender.com` hostnames, leave
`COOKIE_SAME_SITE=none`. After assigning related custom domains such as
`app.knoxit.com` and `api.knoxit.com`, change it to `lax`.

After Render provides the API URL, configure and redeploy the Vercel frontend:

- `VITE_API_BASE_URL=https://knoxit-api.onrender.com` (use the actual URL)
- `VITE_USE_MOCK_API=false`

Frontend Vercel settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- `VITE_USE_MOCK_API=false`
- `VITE_API_BASE_URL=https://your-api.example.com`

`vercel.json` includes an SPA rewrite so protected and nested routes keep working when users refresh a page.

Public invite links are supported at `/join/CODE` and `/join?code=CODE`.

Users can change the app accent from the drawer's Colour Code picker. Presets and custom `#RRGGBB` values are saved locally in the browser.

## Important Files

- `src/app/router.tsx` - application routes and protected-route wiring.
- `src/services/api/knoxitApi.ts` - RTK Query API layer and `VITE_USE_MOCK_API` mock switch.
- `src/domain/rules.ts` - centralized gameplay and permission rules.
- `server/src/server.ts` - Express route registration.
- `lib/db/src/schema.ts` - Drizzle/Neon Postgres schema.
- `docs/Knoxit_User_Journey_Map.md` - product flow source of truth.
