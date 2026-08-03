// artifacts/api-server/src/routes/account.ts
//
// Sign Out itself needs NO backend route — it's purely client-side
// (supabase.auth.signOut() clears the session token locally). Everything
// else here is real.
//
// NOTE: Delete Account was removed from the product (25 Jul 2026) — no
// DELETE /api/account route here. If it comes back later, remember: every
// table referencing users.id already uses `onDelete: "cascade"`
// (league_members, picks, join_requests, chip_ledger, league_messages,
// active_boosters, ad_reward_progress, notification_preferences), so
// deleting the users row would cascade automatically — no manual cleanup
// needed across those tables. It would still need a separate
// supabase.auth.admin.deleteUser(userId) call to remove the actual auth
// identity, since that's a different system from this public.users row.

import { Router } from "express";
import { db } from "@db/index";
import { users, notificationPreferences } from "@db/schema";
import { eq } from "drizzle-orm";
import { applyChipTransaction } from "../lib/chipLedger";

export const accountRouter = Router();

// ---------------------------------------------------------------------------
// GET /api/account/notifications — current preferences (creates defaults
// on first access if none exist yet)
// ---------------------------------------------------------------------------

accountRouter.get("/notifications", async (req, res) => {
  const userId = req.userId as string;

  let [prefs] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId));
  if (!prefs) {
    [prefs] = await db.insert(notificationPreferences).values({ userId }).returning();
  }

  res.json(prefs);
});

// ---------------------------------------------------------------------------
// PATCH /api/account/notifications — update one or more preferences
// ---------------------------------------------------------------------------

accountRouter.patch("/notifications", async (req, res) => {
  const userId = req.userId as string;
  const { pickLockReminders, resultAlerts, chatMessages, friendsLeagueRequests } = req.body ?? {};

  const updates: Record<string, boolean> = {};
  if (typeof pickLockReminders === "boolean") updates.pickLockReminders = pickLockReminders;
  if (typeof resultAlerts === "boolean") updates.resultAlerts = resultAlerts;
  if (typeof chatMessages === "boolean") updates.chatMessages = chatMessages;
  if (typeof friendsLeagueRequests === "boolean") updates.friendsLeagueRequests = friendsLeagueRequests;

  const [existing] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId));
  if (!existing) {
    await db.insert(notificationPreferences).values({ userId, ...updates });
  } else {
    await db
      .update(notificationPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notificationPreferences.userId, userId));
  }

  const [prefs] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId));
  res.json(prefs);
});

// ---------------------------------------------------------------------------
// GET /api/account/referral — my code + how many people I've referred
// ---------------------------------------------------------------------------

accountRouter.get("/referral", async (req, res) => {
  const userId = req.userId as string;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(404).json({ error: "Account not found" });

  const referredUsers = await db.select({ id: users.id }).from(users).where(eq(users.referredByUserId, userId));

  res.json({
    referralCode: user.referralCode,
    totalReferred: referredUsers.length,
  });
});

// ---------------------------------------------------------------------------
// POST /api/account/referral/redeem — used once, at signup, when a new user
// enters someone else's referral code. Rewards BOTH parties.
// ---------------------------------------------------------------------------

const REFERRAL_BONUS_CHIPS = 200;

accountRouter.post("/referral/redeem", async (req, res) => {
  const userId = req.userId as string;
  const { code } = req.body ?? {};

  if (!code) return res.status(400).json({ error: "code is required" });

  const [me] = await db.select().from(users).where(eq(users.id, userId));
  if (!me) return res.status(404).json({ error: "Account not found" });
  if (me.referredByUserId) {
    return res.status(400).json({ error: "You've already redeemed a referral code" });
  }

  const [referrer] = await db.select().from(users).where(eq(users.referralCode, code));
  if (!referrer) return res.status(404).json({ error: "Invalid referral code" });
  if (referrer.id === userId) return res.status(400).json({ error: "You can't refer yourself" });

  await db.update(users).set({ referredByUserId: referrer.id }).where(eq(users.id, userId));

  await applyChipTransaction({
    userId,
    type: "referral_bonus",
    amount: REFERRAL_BONUS_CHIPS,
    note: `Referral bonus — used ${referrer.username}'s code`,
  });
  await applyChipTransaction({
    userId: referrer.id,
    type: "referral_bonus",
    amount: REFERRAL_BONUS_CHIPS,
    note: `Referral bonus — ${me.username} used your code`,
  });

  res.json({ redeemed: true, bonusChips: REFERRAL_BONUS_CHIPS });
});
