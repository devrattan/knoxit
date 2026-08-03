# KNOXIT — Master Build Tracker

Legend: ✅ Done &nbsp; 🔧 In progress &nbsp; ⬜ Not started &nbsp; ❓ Unconfirmed (needs you to verify in Replit)

Last updated: 25 July 2026 · Target launch: 22 Aug 2026 (EPL GW1) — **28 days out**

**Strategic decision (22 Jul 2026):** Real-money activation is **deferred to next season**. Curaçao licence application has not started and will not be pursued this year. This launch cycle (22 Aug 2026 GW1 onward) is **free-to-play / chips-only for the full season** — not just GW1–GW3 as previously planned. This removes the licence clock as a launch blocker, but also removes rake as a revenue stream this year — the chip shop becomes the sole monetization channel for this season.

**Architecture decision (25 Jul 2026): Web launches first (22 Aug 2026 target), native iOS/Android app follows later as a fast-follow post-launch.** This means:
- `replit.md`'s web stack (React + Vite + Tailwind + wouter) is the correct and complete architecture for **this** launch — it wasn't wrong, just describing phase 1.
- The design work happening in Claude (Home v2, etc.) is now the **actual basis for the real launch frontend**, not just a throwaway prototype — good return on the time spent getting it pixel-right.
- Native app planning (Expo/React Native, shared vs. separate codebase, app store review timelines) is deferred and does not block this launch — revisit once web is live and stable.

**Workflow rule (25 Jul 2026, standing):** Every UI/product decision from here on gets its matching backend code (schema + routes) written in the same pass, into the `knoxit-drop-in` bundle (`lib/db/src/schema.ts`, `lib/api-zod`, `artifacts/api-server/src/routes/`). No more UI-only sessions — frontend and backend stay in lockstep so the bundle is always a complete, ready-to-copy package for Replit. See `knoxit-drop-in/README.md` for what's in it and what's still a known gap (auth middleware, results engine, etc.).

---

## 1. DATABASE (Supabase)

- ❓ `fixtures` table created in Supabase (id, home_team, away_team, matchday, utc_date, status, home_score, away_score) — per replit.md this must be created manually, no confirmation it's done
- ⬜ `users` / auth table — not mentioned yet, needed before any pick logic
- ⬜ `leagues` table (league_id, sport, format, entry_fee, vault, gameweek, status) — **vault field must support incremental growth per joiner (decided 22 Jul 2026)**, not a fixed value set at league creation
- ⬜ `league_members` table (user_id, league_id, status: alive/knocked_out)
- ⬜ `picks` table (user_id, league_id, gameweek, primary_pick, backup_pick, result)
- ⬜ `chips_ledger` table (user_id, balance, transaction_history) — needed once Shop goes live
- ✅ `league_messages` table (id, league_id, user_id, content, created_at) — powers league chat, schema written
- ⬜ RLS (Row Level Security) policies — critical before real user data touches Supabase. **`league_messages` specifically needs this before launch** — without it, anyone could read/write chat for leagues they're not in (see `chat.ts` for the exact policy needed)
- ⬜ **Supabase Realtime must be manually enabled on `league_messages`** in the dashboard (not code) — league chat won't actually be live without this step
- ⬜ Seed/test data plan for demo leagues

## 2. API / BACKEND (`artifacts/api-server`)

- ✅ Express 5 server scaffolded
- ✅ `POST /api/fixtures/sync` — pulls from football-data.org, upserts to Supabase
- ✅ `GET /api/fixtures` — returns stored fixtures
- ✅ Supabase client wrapper (`lib/supabase.ts`) — null-safe if env vars missing
- ✅ football-data.org fetch helper — server-side only, key never exposed
- ⬜ Auth endpoints (signup/login/session) — Supabase Auth or custom?
- ⬜ `POST /api/leagues` — create league
- ⬜ `POST /api/leagues/:id/join` — join league
- ⬜ `POST /api/picks` — submit pick (with lock-time validation)
- ✅ `GET /api/picks/me` — user's picks across all leagues (powers Picks tab), written
- ✅ `GET /api/leagues/available-teams/:leagueId` — used/available teams for the Pick Submission screen
- ✅ `GET /api/leagues/:id/messages`, `POST /api/leagues/:id/messages` — league chat history + send (live push handled by Supabase Realtime, not these routes)
- 🔧 `GET /api/standings/:league` — route scaffolded (`standings.ts`), but the actual football-data.org call is stubbed (501) since it needs your existing `footballData.ts` helper's real export name/signature, which isn't visible from here — quick fix once someone fills in the one marked TODO line
- ⬜ Elimination/results engine — cron or webhook that resolves picks after matches complete
- ⬜ `GET /api/leagues/:id` — league detail / command center data
- ✅ Shop/chips endpoints — `POST /api/shop/purchase` (featured items + boosters, real, chip-funded), `POST /api/shop/daily-reward/claim`, `GET /api/shop/balance` all done. Real-money chip pack purchase is a stub (`POST /api/shop/chip-packs/:packId/purchase` returns 501) — needs an actual Stripe/IAP integration, not something to fake
- ⬜ Payment/rake handling — **deferred to next season**, not part of this year's build scope
- ⬜ OpenAPI spec (`lib/api-spec/openapi.yaml`) kept current — codegen depends on this being the source of truth

## 3. UI / FRONTEND SCREENS (`artifacts/knoxit/src/pages`)

**Restart decision (23 Jul 2026): full design redo, starting from Home, one screen at a time, frozen and approved before moving on. Previous League Detail/Survivors/Opponent Profile drafts are scrapped — not built against approved reference mockups.**

Per your Build Order in replit.md:

- ✅ Home tab — **v2 approved** (Join New Leagues → Friends Leagues [new] → Your Dashboard → elimination banner)
- ✅ My Leagues tab — **approved** (Active/Friends/Live/Knocked Out/Won Vaults tabs, league cards with Pick/Backup pills, Friends badge)
- ✅ League Detail / Command Center — **approved** (Overview/Chat/History tabs, Your Pick, Survivors row, Knocked Out, League History)
- ✅ Opponent Profile — built
- ⬜ All Survivors (View All from League Detail) — still a placeholder
- ⬜ Pick Flow (primary + backup selection) — superseded by Pick Submission screen (see Picks tab entry below), functionally done
- ⬜ Standings (within League Detail)
- ✅ **Fixtures tab** — **rebuilt around gameweek navigation (25 Jul 2026)**, replacing the earlier Today/Tomorrow/Upcoming sections entirely. A ◀ Gameweek N ▶ control lets you flip between weeks: the current/upcoming gameweek shows kickoff time + venue per fixture, while navigating back to a completed gameweek shows the final score plus each team's last-5 form badges instead. League switcher and Form Guide standings table unchanged. Fixture data reuses your existing `GET /api/fixtures` (filter by gameweek/matchday); Form Guide needed the new `standings.ts` route since football-data.org's standings live at a separate endpoint from fixtures.
  - **Open question (25 Jul 2026, not yet decided):** form badges currently show by default on every fixture row (not hidden behind a tap) — deliberate for now since the tab's whole purpose is "check form, plan your picks," and hiding it behind per-match taps would add friction to that exact decision. Revisit once real fixture data is wired in and a full ~10-match gameweek shows how visually busy this actually gets — if too cluttered, consider a single list-wide compact/expand toggle rather than per-match tap targets.
- ⬜ Leaderboard tab
- ✅ **Picks tab** — built, scoped deliberately: 4 sections (Locking Soon, Live Now, Awaiting Results, Submitted Picks), Pick History deferred as lowest-urgency. Kept distinct from My Leagues on purpose — My Leagues is browse-by-league, Picks is urgency-by-action across all leagues at once, to prevent accidental elimination from a missed pick. Considered replacing with an "Ads/Rewards" tab instead — decided against it; ad-watching-for-chips is a monetization feature (check-when-you-want), not a safety feature (check-or-lose), so it belongs inside Shop instead of taking one of 5 nav slots.
- ✅ **Pick Submission screen** — built alongside Picks tab so "Take Action" has somewhere real to go (team grid, primary + optional backup, already-used teams greyed out per the team-pool-reset rule)
- ✅ **Shop tab** — built with a deliberate split (25 Jul 2026): Daily Free Reward, Featured items (Second Chance/Extra Pick/Safe Pick), and Boosters (Streak Shield/Opponent Reveal/Lock Extension/Double Week) are **fully functional**, spending chips already earned via the existing chip ledger. Chip Packs (real-money purchases) are **honestly stubbed** — shown as "Coming Soon" with the purchase button disabled, since no payment gateway (Stripe/App Store/Play Store IAP) exists yet. Didn't fake a working purchase flow for something that isn't real.
  - Backend note: each booster's actual gameplay *effect* (e.g. Second Chance flagging a league_members row for elimination-check bypass) is a per-item TODO in `shop.ts` — the chip deduction works, but wiring the effect into elimination/pick logic is separate follow-up work once those systems exist.
  - **Removed (25 Jul 2026): Extra Pick, Double Week, Second Chance, and Safe Pick.** All four directly increased survival odds (a second pick, reviving from elimination, or protecting a pick from elimination) — pay-to-win, conflicting with the "no pay-to-win" positioning on the Shop screen itself. **Featured/Boosters tabs kept separate (not merged)** since more Featured items were planned — Boosters has Streak Shield/Opponent Reveal/Lock Extension.
  - **Added (25 Jul 2026): Draw Shield booster.** If your pick draws, you survive instead of being eliminated — activated before lock, for a specific league + gameweek. Deliberately kept despite the same direct-survival-effect tension as the removed items, since it mirrors the backup-pick mechanic already core to the game and is proactive risk-hedging rather than a blanket undo. **Fully wired, not just chip deduction**: new `active_boosters` table tracks which pick it protects, `POST /api/shop/draw-shield/activate` (separate from generic `/purchase` since it needs league+gameweek context), and `resolvePick()` in `picks.ts` was updated to actually distinguish win/draw/loss (previously only took a boolean, which couldn't represent a draw at all — a real bug this booster surfaced) and check for an active shield before eliminating on a draw.
  - **Added (25 Jul 2026): Team Recall booster.** Lets a player pick a team they've already used this cycle again, bypassing the normal pool-reuse rule. Bigger mechanic-bypass than Draw Shield (it undermines the core resource-scarcity skill of the game), so scoped hard: **once per league, for that player's entire time in that league** — not once per gameweek. Fully wired: `active_boosters.team` column added, `POST /api/shop/team-recall/activate` enforces the lifetime-per-league cap at purchase time, and `picks.ts`'s submit route checks for an active Team Recall covering the exact team+gameweek before rejecting an already-used team, marking it consumed once used.
  - **Added (25 Jul 2026): watch-ads acquisition path for every shop item.** Every item can now be earned via chips OR watching a scaled number of rewarded ads (~1 ad per 200 chips of value — Draw Shield needs 5, matching the person's own example). New `ad_reward_progress` table tracks per-user-per-item view counts; `POST /api/shop/watch-ad` increments progress (**must only be called after your ad network's server-side completion callback fires — never trust a bare client claim, that's trivially spoofable, same caution as the Stripe webhook note**); once enough views are banked, the existing purchase/activation routes accept a `viaAds` flag that consumes the credit instead of deducting chips. Draw Shield and Team Recall's usage caps (once per gameweek / once per league) apply identically regardless of which payment path was used — ads aren't a way to bypass those limits.
  - **Removed (25 Jul 2026): Streak Shield.** Never had a concrete mechanic beyond vague inherited mockup copy ("Protect your 3 winning streaks") — was just a chip-deduction stub with no real logic, unlike Draw Shield/Team Recall which got precise rules before being built. Cut rather than guess at what it should do. Boosters tab now has Opponent Reveal and Lock Extension only.
  - **Added (25 Jul 2026): Merch teaser section.** Jerseys, footballs, training gear shown blurred/faded with a "Coming Soon" badge — browsable but not tappable, no purchase logic behind it, purely a preview of a future product line.
  - **Reorganized (25 Jul 2026): Draw Shield and Team Recall moved from Featured into Boosters.** Boosters now has all four: Draw Shield, Team Recall, Opponent Reveal, Lock Extension. Featured is empty again, reserved for future items. Chip Packs stays its own separate section (confirmed, not merged into the tabbed list) — checked the code for an actual duplicate-rendering bug and found none; it only renders once in each file.
  - **Added (25 Jul 2026): League Pulse booster.** See what % of your league picked each team this gameweek, before lock — pure information, zero survival-odds effect (safest category, same as Opponent Reveal). Genuinely simple to build: no elimination logic touched, just an aggregate `COUNT...GROUP BY` query over the existing `picks` table, gated behind an active booster purchase for that league+gameweek (same `active_boosters` pattern as Draw Shield/Team Recall). Doesn't reveal who picked what, only the aggregate breakdown — individual opponents' picks stay Opponent Reveal's job. Fully wired: `POST /api/shop/league-pulse/activate` and `GET /api/shop/league-pulse/:leagueId/:gameweek` both real, not stubs. Boosters is now 5 items: Draw Shield, Team Recall, League Pulse, Opponent Reveal, Lock Extension.
  - **Fixed (25 Jul 2026): Chip Packs was appearing under both Featured and Boosters tabs.** Not an actual code duplication (verified — it only ever rendered once), but it sat below the tab toggle unconditionally, so it never disappeared when switching to Featured, looking like it was "in both." Now it only renders when the Boosters tab is active.
  - **Redesigned (25 Jul 2026): Merch teaser section**, matching a reference design — diagonal "COMING SOON" ribbon, centered lock icon, colored glow background per category, title+subtitle below. Expanded from 3 to 9 categories: Jerseys (featured, full-width), Footballs, Boots & Gear, Fan Merch, Badges, Cosmetics, Vault Skins, Special Rewards, Coupon Rewards.
  - **Removed (25 Jul 2026): "MERCH" section heading and Featured tab's "More coming soon" text.** Merch section now opens straight into the Jerseys card with no label above it; Featured tab shows empty space instead of placeholder text when there's nothing in it.
  - **Fixed (25 Jul 2026): Merch had the same "appears in both tabs" bug as Chip Packs.** Same root cause — rendered below the tab toggle unconditionally instead of inside either tab's content. Now Merch only shows under Featured, matching Chip Packs' fix of only showing under Boosters. Worth remembering as a pattern: anything added below the `activeItems` block needs an explicit tab check, or it silently shows on both tabs.
  - **Renamed & reordered (25 Jul 2026): "Featured" tab renamed to "Merch," and tab order flipped.** Boosters now comes first and is the default tab on opening Shop; Merch comes second. "Featured" was the wrong name for a tab that only ever showed Jerseys/Footballs/etc. — "Merch" says what it actually is. The now-unused empty `featuredItems` array was removed from `mockData.ts` entirely rather than left as dead code; noted in its place that a genuine "featured/highlighted item" concept, if wanted later, deserves its own treatment rather than reusing this slot.
  - **⚠️ Flagged (25 Jul 2026): YouTuber subscription-for-chips idea conflicts with YouTube's API policies.** Verified via web search — YouTube's Developer Policies explicitly prohibit incentivizing subscriptions ("must not offer or provide incentives, rewards, or other compensation to users for... subscribing to channels") and incentivized video views. Violating risks API access revocation or account termination, which would also hit the partnered creator's channel. **Recommended alternative, not yet built:** a referral/promo-code system instead — streamer shares a unique code, new users enter it for a chip bonus, attribution tracked that way. Same partnership value, no YouTube API involvement, standard influencer-marketing practice. Needs a decision before any code gets written here.
- ✅ **Explore/Browse Leagues screen** — built, reachable from both "View All Leagues" (Home) and "Explore Leagues" (My Leagues)
- ✅ **Public Friends Leagues flow** — built: browse → Entry Terms detail → Request to Join (with optional message) → creator/admin approves from Manage Requests
  - Decided: **My Leagues gets a dedicated FRIENDS tab** — joined friends leagues show alongside competitive leagues (same card style, small "Friends" badge), so My Leagues stays the single source of truth for everything a user has joined.
  - Decided: **already-joined public friends leagues still appear in the browse/discover list**, shown with a "Joined" state instead of "Request to Join."
  - Database implication: `leagues` table needs a `type` field (public/competitive vs. friends) and a `visibility` field (public/discoverable vs. invite-only), plus a `join_requests` table for the approve/decline flow (requester, league, status, timestamp).
  - **Added (25 Jul 2026): Join with Code.** Friends Leagues get a random, non-guessable 6-character invite code (separate from the readable display code like "WW-1"). Entering a valid code joins **instantly, no creator approval needed** — unlike public discovery, which still requires approval. Already-joined members can see and share their league's code from the request-detail screen.
  - **Added (25 Jul 2026): unique names for Friends Leagues.** Two public Friends Leagues can't share a name (case-insensitive check), avoiding confusion when browsing. Does not apply to competitive leagues, which intentionally reuse the same base name across concurrent instances (distinguished by their display code instead).
  - **Added (25 Jul 2026): Create Friends League screen** — name, max members, entry fee (chips), optional entry terms free text, and public/invite-only visibility toggle. Shows the generated invite code immediately after creation with a copy button.
  - **Decided (25 Jul 2026): co-admins for Friends Leagues.** The creator can promote trusted members to also approve/decline join requests, scoped narrowly — admins can't delete the league, remove the creator, or change other admins' status. Only the original creator can grant/revoke admin. New "Manage Admins" screen, reachable from League Detail's settings icon (currently shown for all leagues — needs to be scoped to friends-league creators/admins only once real auth exists).
  - **Decided (25 Jul 2026): no entry fee, no member cap for Friends Leagues.** Removed both fields from the Create Friends League form entirely — anyone around can join, and since there's no entry fee, there's no Vault either (any prize arrangement lives in the free-text Entry Terms, off-platform). `leagues.maxMembers` is now nullable in the schema (null = uncapped); competitive leagues still require it (default 20). League cards no longer show a vault chip for Friends Leagues.
  - **Added (25 Jul 2026): optional message on join requests.** Requesters can attach a short note ("I'm in, ready to send my share!") when requesting to join, shown to the creator/admin on the approval screen. Same treatment as `entryTerms` — free text, stored and displayed verbatim, never parsed or acted on.
  - **⚠️ Legal flag (25 Jul 2026, not yet resolved): Entry Terms may reintroduce the India real-money exposure already excluded.** The free-text Entry Terms field lets creators write real-money stakes (e.g. "₹500 each, winner takes it all"), and Knoxit is the discovery/matchmaking layer connecting people to that arrangement — even though no money moves through the app. This is arguably the same substance as the real-money gaming already ruled out for India under 2026 legislation, just without a payment flow attached. Not a resolved question — needs either (a) confirmation from whoever advised the India exclusion that this is fine, or (b) restricting Entry Terms / Friends Leagues for India-located users to stay consistent with the existing decision. Not legal advice — flagging the gap, not the answer.
- **Decided (25 Jul 2026): elimination banner removed from Home entirely.** Reconsidered and cut — it was purely decorative (no actionable function), its "View Stats" button led nowhere real, and leading with a failure count ("X eliminated") was inconsistent with the encouraging framing already established elsewhere (the same reasoning that removed the knockout count from My Leagues). The per-league alive/joined counts already shown on each league card cover the "how's it going" need better anyway.
- ✅ **Side menu / hamburger drawer built (25 Jul 2026)** — the top-left hamburger icon (previously non-functional) now opens a slide-out drawer, grouped: **Account** (Profile, Notifications), **Grow** (Invite Friends, Refer & Earn), **Help** (How to Play, FAQ, Contact Support), **Legal** (Terms & Conditions, Privacy Policy), **Other** (About, Sign Out).
  - **Removed (25 Jul 2026): Delete Account.** No longer in the drawer, Profile page, or backend (`account.ts` no longer has a `DELETE /api/account` route). If it's added back later, the cascade-delete groundwork is still documented in `account.ts`'s header comment — every relevant table already uses `onDelete: "cascade"`, so re-adding it later is straightforward.
  - Real backend, not just UI: new `account.ts` routes — `GET`/`PATCH /api/account/notifications`, `GET /api/account/referral`, `POST /api/account/referral/redeem` (rewards both parties in chips via the existing chip ledger).
  - New `users.referralCode` / `referredByUserId` columns and a `notification_preferences` table added to schema; `referral_bonus` added to the chip transaction type enum.
  - Sign Out has a simple confirm step, placeholder-wired (no real Supabase Auth call yet) since actual auth/session handling doesn't exist yet.
  - Terms & Conditions and Privacy Policy are explicitly marked as **placeholder legal text** in the code itself — not reviewed, not for launch as-is.
  - Invite Friends and Refer & Earn kept as two separate, distinctly-scoped pages per explicit request — Invite Friends is a simple share action, Refer & Earn is the fuller stats/code page — both draw from the same referral code.
- ⬜ Onboarding / auth screens (login, signup) — not designed yet at all

## 4. INTERNAL CODING / BUSINESS LOGIC

- ⬜ Home "pending pick" auto-switch logic — explicitly deferred in replit.md until real data is wired
- ⬜ Pick lock-time enforcement (countdown → hard lock)
- ✅ **Elimination logic — corrected (25 Jul 2026).** Previously described (and coded) as "primary pick fails → backup used → both fail → eliminated," which was wrong. Real rule: backup only triggers if the primary team's match is **postponed/abandoned** (not played at all) — a fixture-integrity safeguard, not a second guess. A played match that draws or loses is elimination (or a Draw Shield save on a draw); backup is never consulted in that case. `resolvePick()` in `picks.ts` had this exact bug (fell through to backup on any non-win, including an un-shielded draw) — now fixed to take a `"win" | "draw" | "loss" | "no_result"` outcome, with only `"no_result"` triggering backup. Genuine open edge case, not guessed at: what happens if backup is unset/used and the primary match still doesn't happen — currently left "pending" rather than inventing a default.
- ⬜ Vault growth calculation — **decided: grows per joiner** (22 Jul 2026). Needs: entry-fee-per-join → increment vault, rake-cut logic can stay dormant until real-money switch, decide whether chip-funded leagues also increment a "chip vault" the same way
- ✅ **Decided (22 Jul 2026): entry fee framing stays, paid and won in chips.** Leagues keep "Entry Fee: X chips → Vault: Y chips" language this season — same UI/copy as designed, just chip-denominated instead of real currency. No UI rework needed for My Leagues / League Detail mockups.
- ⬜ Survivor count / league state transitions (active → live → knocked out → won vault)
- ⬜ Chip economy logic (spend, earn, daily reward, purchase)
- ⬜ Notification triggers (locking soon, results in, knocked out)
- ⬜ Real-money activation switch — **deferred to next season**, no longer needed for this year's build

## 5. EXTRA (legal, ops, launch)

- ✅ Licensing strategy decided — Curaçao (CGA) first, UKGC Stage 2 (**paused for this season**)
- ✅ **Decided (22 Jul 2026): Curaçao licence application will NOT be pursued this year.** No external legal clock this season — free-to-play/chips-only for the full season.
- ⬜ Country-by-country legal status doc for all 6 markets — lower priority now given real-money is deferred; revisit ahead of next season's licence push
- ✅ Pitch deck v6 (16 slides, Business Model + Licensing slides added)
- ⬜ Terms of Service / Privacy Policy
- ⬜ Responsible gambling / KYC framework (needed before real-money mid-season switch)
- ⬜ App Store / Play Store listing prep
- ✅ Web vs. native architecture strategy — **decided: web launches first (22 Aug), native is a post-launch fast-follow**
- ⬜ Native app planning (Expo/React Native, codebase strategy) — deferred, revisit after web launch
- ⬜ Marketing plan around EPL fixture release + GW1 launch
- ⬜ Analytics/monitoring setup (crash reporting, funnel tracking)
- ⬜ Deployment pipeline (staging → production)

---

## Suggested next action
Home, My Leagues, League Detail, Opponent Profile, Explore Leagues, the full Friends League flow, Picks, Fixtures, Shop, and the side menu are all built with matching backend. Remaining major gaps: **auth/onboarding screens** (nothing exists yet — genuinely blocks real users from ever signing in, arguably the single biggest remaining gap given everything else assumes a logged-in user), Leaderboard, Standings, and the results/elimination engine that would call `resolvePick()` after real match data comes in.

Remaining ❓ item: whether the `fixtures` table actually exists in Supabase yet — worth a quick check in the Replit dashboard.
