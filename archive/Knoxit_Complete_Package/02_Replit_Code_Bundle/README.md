# Knoxit — complete drop-in bundle (Replit handoff)

Everything designed and built so far, as real files at their real repo
paths. Unzip and copy each folder into the matching location in your
Replit project — they mirror your existing structure, so most things
merge in rather than needing to be placed by guesswork.

This README reflects the actual current state of the bundle as of this
export. If you keep working with Claude and get more files, ask for an
updated README rather than trusting an old one.

## Folder map (everything in this zip)

```
lib/db/src/schema.ts                              → merge into your lib/db schema
lib/api-zod/src/knoxit-schemas.ts                  → new file in lib/api-zod

artifacts/api-server/src/lib/chipLedger.ts         → new file
artifacts/api-server/src/routes/leagues.ts         → new file
artifacts/api-server/src/routes/friendsLeagues.ts  → new file
artifacts/api-server/src/routes/picks.ts           → new file
artifacts/api-server/src/routes/splitVote.ts       → new file
artifacts/api-server/src/routes/shop.ts            → new file
artifacts/api-server/src/routes/chat.ts            → new file
artifacts/api-server/src/routes/standings.ts       → new file (partially stubbed, see below)
artifacts/api-server/src/routes/account.ts         → new file

artifacts/knoxit/src/lib/mockData.ts               → new file (temporary — see below)
artifacts/knoxit/src/components/Header.tsx         → new file (or merge if you have one)
artifacts/knoxit/src/components/BottomNav.tsx      → new file (or merge if you have one)
artifacts/knoxit/src/components/Drawer.tsx         → new file (side menu)
artifacts/knoxit/src/pages/Home.tsx                → replaces/merges with existing
artifacts/knoxit/src/pages/MyLeagues.tsx           → replaces/merges with existing
artifacts/knoxit/src/pages/LeagueDetail.tsx        → new page
artifacts/knoxit/src/pages/OpponentProfile.tsx     → new page
artifacts/knoxit/src/pages/ExploreLeagues.tsx      → new page
artifacts/knoxit/src/pages/FriendsLeagues.tsx      → new page (exports 2 components)
artifacts/knoxit/src/pages/JoinByCode.tsx          → new page
artifacts/knoxit/src/pages/CreateFriendsLeague.tsx → new page
artifacts/knoxit/src/pages/ManageRequests.tsx      → new page
artifacts/knoxit/src/pages/ManageAdmins.tsx        → new page
artifacts/knoxit/src/pages/Picks.tsx               → new page
artifacts/knoxit/src/pages/PickSubmission.tsx      → new page
artifacts/knoxit/src/pages/Fixtures.tsx            → new page
artifacts/knoxit/src/pages/Shop.tsx                → new page
artifacts/knoxit/src/pages/menu/Profile.tsx        → new page
artifacts/knoxit/src/pages/menu/NotificationSettings.tsx → new page
artifacts/knoxit/src/pages/menu/ReferAndEarn.tsx    → new page
artifacts/knoxit/src/pages/menu/InviteFriends.tsx   → new page
artifacts/knoxit/src/pages/menu/SignOut.tsx         → new page
artifacts/knoxit/src/pages/menu/StaticPages.tsx     → new file, exports 6 pages (How to Play, FAQ, Terms, Privacy, Support, About)
artifacts/knoxit/src/App.example.tsx                → REFERENCE ONLY, see below
artifacts/knoxit/src/knoxit-additions.css           → append into your existing global CSS
```

## What to actually do, in order

1. **Frontend pages** — copy the `artifacts/knoxit/` files in. `App.example.tsx`
   is deliberately named `.example` — don't drop it in as-is if you already
   have an `App.tsx` with routes for Leaderboard/Standings. Instead, open
   it, copy the new `<Route>` lines into your real `App.tsx`, and use its
   `AppShell` only if you don't already have the phone-frame/mobile-container
   wrapper your `replit.md` describes.

2. **CSS** — append `knoxit-additions.css`'s rules into wherever your
   Tailwind base styles live. Don't create a separate stylesheet import.

3. **Backend files** — copy the `lib/` and `artifacts/api-server/` files in.
   Read each route file's header comment — every one has specific
   integration notes, several call out real gaps explicitly (see below).

4. **Auth middleware is THE blocker.** Every backend route assumes
   `req.userId` already exists from an upstream auth check. That doesn't
   exist yet — no login/signup screens, no session handling, nothing.
   Nothing in `artifacts/api-server/` will actually work until this is
   built. This is genuinely the single most important next thing, more
   than any more screens or features.

5. **Replace `mockData.ts` gradually.** Frontend pages currently import
   from `lib/mockData.ts` so they render something without a live backend.
   Once each backend route is wired and your OpenAPI codegen produces real
   hooks (`lib/api-client-react`), swap each page's mock import for the real
   hook, one page at a time — `// TODO` comments in each page mark exactly
   where.

6. **Team pools** in `picks.ts` (`TEAM_POOLS`) are placeholder data
   (Premier League only, hand-typed). Replace with real team lists, ideally
   derived from your existing fixture sync so they can't drift out of sync.

7. **OpenAPI spec** — per your own `replit.md` rule, none of these new
   endpoints are in `lib/api-spec/openapi.yaml` yet. Add them and run your
   codegen command before wiring the frontend to real hooks, or you'll end
   up hand-writing fetches, which your own rules say not to do.

8. **Two manual Supabase dashboard steps for chat** (not code — see
   `chat.ts`'s header): enable Realtime on the `league_messages` table, and
   add an RLS policy restricting messages to league members only. Chat
   won't be live, or will be readable by non-members, without these.

## What's fully real vs. what's stubbed — be honest with yourself here

**Fully functional backend logic (not stubs):**
- Leagues: create, join, league detail, vault-grows-per-joiner
- Friends Leagues: browse, request-to-join with optional message, approve/decline, co-admin promotion, join-by-code (instant), unique names, no entry fee/no member cap
- Picks: submission, team-pool-reuse enforcement with reset, **corrected elimination logic** (see below)
- Split vote: propose/vote, unanimous-required, once-per-gameweek retry cap
- Shop: chip-funded purchases via the real chip ledger, Draw Shield / Team Recall / League Pulse all fully wired with their exact scoped rules, daily reward claim, watch-ads alternative acquisition path
- Chat: history + send (real-time push is Supabase Realtime, see setup step above)
- Account: notification preferences, referral code + redemption (rewards both parties)

**Explicitly NOT built, stubbed, or needing real integration work:**
- **Auth** — nothing exists. Biggest gap.
- **Payment gateway** (Stripe or IAP) for real-money chip packs — `shop.ts`'s chip-pack route is a deliberate 501 stub, not faked
- **Ad network SDK integration** — the watch-ads flow assumes a server-side completion callback that doesn't exist yet; never wire the demo's "tap to increment" pattern directly to production
- **Standings/Form Guide data** (`standings.ts`) — route is scaffolded but the actual football-data.org call is a 501 stub; needs your existing `footballData.ts` helper's real export wired in (one line, marked with TODO)
- **Results/elimination engine** — nothing calls `resolvePick()` yet after real match results come in; that's a cron/webhook job you still need to build
- **Delete Account** was designed then explicitly removed from scope — not in the drawer, Profile, or backend

## A few correctness notes worth reading, not just skimming

- **Backup pick rule was fixed on 25 Jul 2026 — read `picks.ts`'s `resolvePick()` comment before touching it.** Backup does NOT trigger on a loss or draw. It ONLY triggers if the primary match is postponed/abandoned (a `"no_result"` outcome). A previous version of this function had that wrong; if you're diffing against an older copy, take the current one.
- **`entryTerms`** (Friends Leagues) and **join request `message`** are free text, stored and displayed verbatim, never parsed or acted on programmatically. Keep it that way — it's the basis for treating Friends Leagues as materially different from real-money matchmaking. There's an open, unresolved legal question flagged in the tracker about whether this holds up for India specifically, given your own earlier decision to exclude India from real-money gaming — worth resolving before real users touch this feature.
- **Chips have no cash value this season** — real-money activation and the Curaçao licence were both deliberately deferred. Terms & Privacy pages in the bundle are explicitly marked as placeholder text, not reviewed, not for launch as-is.
- **No item in Shop directly increases survival odds** except Draw Shield and Team Recall, both deliberately narrow-scoped (once per gameweek / once per league lifetime) after several broader versions (Second Chance, Extra Pick, Double Week, Safe Pick, Streak Shield) were cut for being too close to pay-to-win.
