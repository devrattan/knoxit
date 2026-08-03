# Knoxit

Production-oriented Knoxit web setup generated from `Plan.txt`, the approved single-file visual prototype, the user journey map, and `Knoxit_Complete_Package.zip`.

## Run

```bash
npm install
npm run dev
```

The web app runs on `http://localhost:5173`.

## Validate

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run typecheck:server` is available separately for the copied Express/Drizzle route bundle. It currently reports Drizzle write-type mismatches from the supplied handoff code; see `docs/Architecture_Audit.md`.

## Free Deploy

Recommended path: push this repo to GitHub, then import it into Vercel.

Vercel settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables for demo/static mode:
  - `VITE_USE_MOCK_API=true`

`vercel.json` includes an SPA rewrite so protected and nested routes keep working when users refresh a page.

## Important Files

- `src/app/router.tsx` - application routes and protected-route wiring.
- `src/services/api/knoxitApi.ts` - RTK Query API layer and `VITE_USE_MOCK_API` mock switch.
- `src/domain/rules.ts` - centralized gameplay and permission rules.
- `server/src/server.ts` - Express route registration.
- `lib/db/src/schema.ts` - Drizzle/Supabase schema.
- `docs/Knoxit_User_Journey_Map.md` - product flow source of truth.
