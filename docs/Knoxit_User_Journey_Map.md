# Knoxit — User Journey Map
**Base reference for UI/UX design, frontend development, and database architecture**
Last updated: 26 Jul 2026 · Covers 26 built screens + documented gaps

---

## How to use this document

Three disciplines read this differently, so it's structured for all three:
- **UI/UX**: read the Journey Flows (Section 2) — every screen-to-screen path a real user takes, including dead ends and edge cases.
- **Frontend**: read the Screen Inventory (Section 3) — every screen's entry points, exit points, and states.
- **Database/architecture**: read the Data Touchpoint Map (Section 4) and Schema Summary (Section 6) — which screens read/write which tables, and why the schema is shaped the way it is.

Where a decision has a **reason behind it** (not just "what"), that reason is included, because it affects how safely the flow can be changed later.

---

## 1. Product summary (context for all three disciplines)

Knoxit is a football survivor pool: each Gameweek, pick one team to win. Win → survive. Draw/lose (when the match is actually played) → eliminated, unless a **Draw Shield** booster is active. If the primary team's match is **postponed or abandoned** (not played), the backup pick is checked instead — backup is a fixture-integrity safeguard, not a "second guess."

Two league types share almost all UI: **Competitive** (public, chip entry fee, 20-team pool, admin-created) and **Friends** (invite-only or public-with-approval, no entry fee, no member cap, creator-defined free-text "Entry Terms" for any off-platform arrangement).

Monetization this season is chip-only — no real money changes hands through the app (real-money activation deferred; see Section 7).

---

## 2. Journey Flows

### 2.1 First-time entry (⚠️ GAP — not designed yet)
```
[App opens] → ??? NO LOGIN/SIGNUP SCREENS EXIST ???
```
This is the single biggest gap in the whole product. Every journey below *assumes* a logged-in user. Auth screens (signup, login, session handling) need to be designed before any of these journeys are real. See Section 7.

### 2.2 Core gameplay loop (the journey that repeats every Gameweek)
```
Home
 ├─→ Fixtures (check form, plan pick) ──┐
 ├─→ Picks tab (see what's locking) ────┤
 │                                       ↓
 │                              Pick Submission
 │                          (pick primary + optional backup team;
 │                           already-used teams greyed out)
 │                                       ↓
 │                              [Lock In Pick] → back to Picks tab
 │
 ├─→ My Leagues → tap a league card → League Detail
 │                                       ├─ Overview tab: Your Pick, Survivors, Knocked Out, Vault
 │                                       ├─ Chat tab: league messages (real-time)
 │                                       └─ History tab: past Gameweek results
 │
 └─→ [results come in via backend job — NOT YET BUILT, see Section 7]
      → pick.result becomes survived/eliminated
      → league_members.status updates if eliminated
      → user sees updated state next time they open League Detail/My Leagues
```
**Key rule embedded here**: a team once picked can't be picked again until every team in the pool has been used (`getUsedTeamsThisCycle` in `picks.ts`) — this is why Pick Submission greys out used teams, not a UI-only restriction.

### 2.3 League Detail → deeper exploration
```
League Detail (Overview tab)
 ├─→ tap a survivor avatar → Opponent Profile
 │                            (their current pick status, survival timeline, stats)
 ├─→ "View All" (Survivors) → [All Survivors — ⚠️ GAP, not built]
 ├─→ Split the Vault (only visible when ≤5 alive)
 │    ├─ Propose Split → other survivors vote
 │    ├─ All agree → vault splits evenly, league ends
 │    └─ Anyone declines → league continues, can retry next Gameweek
 └─→ ⚙️ settings icon → Manage Admins (Friends Leagues only — currently
      shows for all leagues, needs scoping once auth exists to know
      creator/admin status properly)
```

### 2.4 Discovering & joining a competitive league
```
Home ("Join New Leagues" carousel, or "View All Leagues")
  → Explore Leagues (full list, all sports)
      → [Join Now] → (backend: POST /api/leagues/:id/join)
          → deducts entry fee chips → increments vault → adds league_members row
          → lands in My Leagues → Active tab
```

### 2.5 Friends League — as a joiner (public discovery path)
```
Home ("Friends Leagues" row → "View All")
  → Public Friends Leagues (browse)
      → tap a league → Friends League Request Detail
          (see creator, member count, their free-text Entry Terms)
          → write optional message ("I'm in, ready to send my share!")
          → [Request to Join] → creator/admin must approve
              ↓ (creator side, separate session)
          Home → "Requests" badge → Manage Requests
              → [Approve] → joinLeagueInternal() runs → requester is now a member
              → [Decline] → requester notified request was declined (⚠️ notification not built)
```

### 2.6 Friends League — as a joiner (code path, bypasses approval)
```
Home ("Join with Code" card) → Join by Code
    → enter code → instant join, NO approval step
    (deliberately different from 2.5 — a valid code is treated as
    proof the creator already invited this person)
```

### 2.7 Friends League — as a creator
```
Home ("Create Friends League") → Create Friends League
    → name (uniqueness checked live) + optional Entry Terms + visibility toggle
    → [Create League] → generates unique invite code
    → success screen shows code + Copy button
    → lands in My Leagues → Friends tab
    (later) League Detail → ⚙️ → Manage Admins
    → promote a trusted member to co-admin (can approve requests,
      cannot delete league / remove creator / promote others)
```

### 2.8 Shop / economy loop
```
Any tab → Shop
  ├─ Daily Free Reward → claim once/24h → chips += 25
  ├─ Boosters tab (default) → Draw Shield / Team Recall / League Pulse /
  │    Opponent Reveal / Lock Extension
  │    each: [pay chips] OR [watch N ads] → both lead to same grant
  ├─ Chip Packs (below Boosters only) → real-money, DISABLED, "Coming Soon"
  └─ Merch tab → Jerseys/Footballs/etc., all locked, "Coming Soon" ribbons
```
**Key rule**: every booster in Shop was deliberately vetted against "does this directly increase survival odds without a real constraint?" — five earlier items (Second Chance, Extra Pick, Double Week, Safe Pick, Streak Shield) were cut for failing this test. The three that involve real gameplay effect (Draw Shield, Team Recall, League Pulse) all have hard caps (once/gameweek, once/league-lifetime, info-only respectively).

### 2.9 Side menu / account
```
Any tab → ☰ (top-left) → Drawer
  ├─ Profile → Sign Out
  ├─ Notifications → toggle 4 preference types
  ├─ Invite Friends → share link (simple)
  ├─ Refer & Earn → code + stats (both give/get 200 chips on redemption)
  ├─ How to Play / FAQ / Contact Support
  └─ Terms & Conditions / Privacy Policy (⚠️ placeholder legal text)
```

---

## 3. Screen Inventory

| # | Screen | Entry points | Exit points | Key state |
|---|---|---|---|---|
| 1 | Home | App launch (default) | Fixtures, Picks, Shop, My Leagues, Explore Leagues, Friends Leagues (browse/join-by-code/create/requests), Drawer | Chip balance, league previews |
| 2 | My Leagues | Bottom nav | League Detail, Explore Leagues | Active/Friends/Live/Knocked Out/Won Vaults tabs |
| 3 | League Detail | My Leagues card tap, Friends League "Enter" | Opponent Profile, Manage Admins, All Survivors (gap) | Overview/Chat/History tabs; Split Vault state |
| 4 | Opponent Profile | Survivor avatar tap in League Detail | Back to League Detail | Read-only |
| 5 | Explore Leagues | Home "View All Leagues", My Leagues "Explore Leagues" | Join confirmation (gap — Join button not wired to a flow yet) | List of all public leagues |
| 6 | Picks | Bottom nav | Pick Submission | Locking Soon / Live / Awaiting / Submitted sections |
| 7 | Pick Submission | Picks tab "Locking Soon" item tap | Back to Picks | Team grid, used teams greyed out |
| 8 | Fixtures | Bottom nav | none (informational) | Gameweek navigator (◀ ▶), league switcher |
| 9 | Shop | Bottom nav | none (all actions in-place) | Boosters/Merch tabs, per-item ad progress |
| 10 | Public Friends Leagues (browse) | Home "View All" (Friends) | Friends League Request Detail, Join by Code | List, "Joined" badge if applicable |
| 11 | Friends League Request Detail | Browse list tap | Back to browse | Request state: idle → requested / already-member |
| 12 | Join by Code | Home "Join with Code" | My Leagues (on success) | Code input, success/error state |
| 13 | Create Friends League | Home "Create Friends League" | My Leagues (on success) | Form → success screen w/ code |
| 14 | Manage Requests | Home "Requests" badge | none | List of pending requests, Approve/Decline |
| 15 | Manage Admins | League Detail ⚙️ | Back to League Detail | Member list, toggle admin (creator-only) |
| 16 | Profile | Drawer | Sign Out | Basic account info |
| 17 | Notification Settings | Drawer | none | 4 toggles |
| 18 | Refer & Earn | Drawer | none | Code, copy state, referred count |
| 19 | Invite Friends | Drawer | none (share sheet) | — |
| 20 | Sign Out | Drawer, Profile | Home (on confirm) | Confirm/cancel |
| 21–26 | How to Play, FAQ, Terms, Privacy, Support, About | Drawer | Back | Static content |

**Not yet built (referenced by the UI but no screen exists):**
- Auth/onboarding (login, signup) — see Section 7
- All Survivors (League Detail "View All" survivors link)
- Leaderboard / Standings (beyond the Fixtures tab's Form Guide table)
- Join confirmation flow for Explore Leagues' "Join" button

---

## 4. Data Touchpoint Map (screen → table)

This is what a DB architect needs: which screens actually read/write which tables, so schema changes can be checked against real usage.

| Screen | Reads | Writes |
|---|---|---|
| Home | `leagues`, `league_members`, `users` (chip balance) | — |
| My Leagues | `leagues`, `league_members`, `picks` | — |
| League Detail | `leagues`, `league_members`, `picks`, `league_messages`, `split_votes`, `split_vote_responses` | `league_messages` (send), `split_votes`/`split_vote_responses` (propose/vote) |
| Opponent Profile | `picks`, `league_members` | — |
| Pick Submission | `leagues`, `picks` (used-teams check), `active_boosters` (Team Recall check) | `picks` (insert) |
| Explore Leagues | `leagues` | — |
| Public Friends Leagues | `leagues`, `league_members`, `join_requests` | — |
| Friends League Request Detail | `leagues` | `join_requests` (insert) |
| Join by Code | `leagues` (by `inviteCode`) | `league_members` (insert), `chip_ledger` (entry fee, always 0 for Friends) |
| Create Friends League | `leagues` (uniqueness check) | `leagues` (insert), `league_members` (creator auto-join) |
| Manage Requests | `join_requests`, `leagues`, `users` | `join_requests` (resolve), `league_members` (insert on approve) |
| Manage Admins | `league_members`, `leagues` | `league_members.isAdmin` |
| Shop | `chip_ledger` (balance), `ad_reward_progress` | `chip_ledger` (purchases), `active_boosters` (Draw Shield/Team Recall/League Pulse activation), `ad_reward_progress` |
| Notification Settings | `notification_preferences` | `notification_preferences` |
| Refer & Earn / Invite Friends | `users` (referralCode) | `users.referredByUserId`, `chip_ledger` (both-party bonus) |

**Backend logic that touches data but has no dedicated screen:**
- `resolvePick()` (`picks.ts`) — writes `picks.result`, `league_members.status`. Not yet called by anything (no results engine built).
- Split vote resolution — writes `chip_ledger` (payout), `leagues.status = 'split'`.

---

## 5. Key business rules (the "why," for anyone extending this later)

1. **Backup pick ≠ second guess.** Only triggers on `no_result` (postponed/abandoned), never on a played loss/draw. This was fixed after being wrong in an earlier build — see `picks.ts` header comment.
2. **Team pool resets, doesn't lock forever.** Once every team in the pool has been used, the cycle resets. Otherwise leagues running longer than the team count would be unplayable.
3. **Vault grows per joiner, fixed once locked.** Not recalculated after lock — Split Vote uses the frozen amount.
4. **Friends League `entryTerms`/join-request `message` are opaque text, never parsed.** This is a deliberate legal position (see Section 7) — don't build logic that reads these fields programmatically.
5. **Shop items are vetted against pay-to-win.** Anything that directly and repeatably increases survival odds gets cut or hard-capped (once/gameweek, once/league-lifetime).
6. **Chips have no cash value this season.** Real-money paths (chip packs, Curaçao licence) are deferred, not removed — the chip ledger already has the transaction types ready for when that switch flips.
7. **Ad rewards require server-verified completion.** The demo's "tap to increment" pattern is explicitly NOT how production should work — every ad-reward endpoint's comment flags this.

---

## 6. Database Schema Summary

| Table | Purpose |
|---|---|
| `users` | Profile, chip balance, referral code/referrer |
| `notification_preferences` | Per-user notification toggles |
| `leagues` | Both competitive and friends leagues; type/visibility/status/vault/entry fee/invite code/entry terms |
| `league_members` | Membership + alive/knocked-out status + per-league admin flag |
| `picks` | Primary/backup team per user per league per gameweek, result |
| `join_requests` | Friends League join requests + optional message |
| `split_votes` / `split_vote_responses` | Vault split proposal + per-member vote |
| `league_messages` | League chat history (live push will use the Express WebSocket/SSE layer) |
| `active_boosters` | Pick-specific booster activations (Draw Shield, Team Recall, League Pulse) — tracks exactly which league+gameweek(+team) each covers |
| `ad_reward_progress` | Per-user-per-item watched-ad counter |
| `chip_ledger` | Every chip movement, append-only, never mutated in place |

Enums worth knowing: `league_type` (competitive/friends), `league_visibility` (public/invite_only), `pick_result` (pending/survived/eliminated), `booster_type` (draw_shield/team_recall/league_pulse), `chip_transaction_type` (9 types covering every chip movement source).

---

## 7. Known gaps — ranked by how much they block real users

1. **Auth/onboarding** — nothing exists. Every journey above assumes a logged-in user. Blocks everything.
2. **Results/elimination engine** — nothing calls `resolvePick()` after real match data. Without this, picks never actually resolve to survived/eliminated.
3. **Payment gateway** (Stripe) — Chip Packs are UI-complete but functionally disabled.
4. **Ad network SDK** — watch-ads flow needs real server-side verification, currently demo-only.
5. **Standings/Form Guide real data** — `standings.ts` is a stub; needs the existing `footballData.ts` helper wired in.
6. **⚠️ Unresolved legal question**: Friends League `entryTerms` may reintroduce the India real-money exposure already excluded from this season's plan (India was ruled out for real-money gaming under 2026 legislation). Not legal advice — flagged for someone qualified to review before real users encounter this feature.
7. **All Survivors, Leaderboard/Standings screens** — referenced by UI ("View All") but not designed.
