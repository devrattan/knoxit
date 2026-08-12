# Knoxit Architecture Audit

## Current Shape

- The root is now a fresh Vite React application built from the supplied Knoxit production bundle.
- `src/pages` and `src/components` contain the migrated screen set from the handoff bundle.
- `src/app` owns routing, providers, the responsive shell, and Redux store setup.
- `src/services/api` owns the RTK Query API boundary and mock/real API switch.
- `src/services/mockData.ts` is the temporary mock data boundary used while pages are moved to RTK Query endpoint hooks.
- `src/domain/rules.ts` centralizes key gameplay and permission rules with tests.
- `server/src` contains the supplied Express route bundle, wired behind an auth placeholder and API server shell.
- `lib/db/src/schema.ts` and `lib/api-zod/src/knoxit-schemas.ts` preserve the supplied Drizzle and Zod contracts.

## Validation Status

- `npm run lint`: passes.
- `npm run typecheck`: passes for the production web app.
- `npm test`: passes 7 domain/business-rule tests.
- `npm run build`: passes and writes `dist/`.
- `npm run typecheck:server`: passes after aligning Drizzle ORM with the current schema types.

## Known Product/Backend Blockers

- Neon-backed email/password authentication and opaque cookie sessions are connected. Password reset email delivery is still pending an email provider.
- Results/elimination cron or webhook is not implemented.
- Standings data remains a 501 route until the real football-data helper is connected.
- Real-money chip packs stay disabled until Stripe/IAP integration exists.
- Rewarded ads require server-side ad network verification; client-side counters must not grant production rewards.
- Live chat delivery still needs an Express-owned WebSocket or SSE layer; REST history and membership authorization already exist.
- Placeholder Terms and Privacy copy is not launch-ready legal text.
