// artifacts/api-server/src/routes/chat.ts
//
// Real-time league chat (25 Jul 2026 decision). Important: the "real-time"
// part does NOT happen in this file. These two REST routes only handle
// fetching history and inserting new messages — the live push to other
// members happens because clients subscribe directly to Postgres changes
// on `league_messages` via the Supabase client SDK (supabase-js), which is
// a separate mechanism from this Express API.
//
// ---------------------------------------------------------------------------
// ONE-TIME SUPABASE SETUP REQUIRED (do this in the Supabase dashboard, not
// in code):
//   1. Table Editor → league_messages → enable Realtime (toggle "Enable
//      Realtime" or run: ALTER PUBLICATION supabase_realtime ADD TABLE
//      league_messages;)
//   2. Add an RLS policy so a user can only SELECT messages for leagues
//      they're a member of — e.g.:
//        CREATE POLICY "members can read league messages"
//          ON league_messages FOR SELECT
//          USING (EXISTS (
//            SELECT 1 FROM league_members
//            WHERE league_members.league_id = league_messages.league_id
//            AND league_members.user_id = auth.uid()
//          ));
//   3. Similarly restrict INSERT to league members only.
// Without these, either chat won't update live (step 1) or anyone could
// read/write messages for leagues they're not in (steps 2-3).
// ---------------------------------------------------------------------------
//
// FRONTEND SUBSCRIBE EXAMPLE (goes in your React chat component, not here):
//   const channel = supabase
//     .channel(`league-${leagueId}-messages`)
//     .on('postgres_changes',
//       { event: 'INSERT', schema: 'public', table: 'league_messages', filter: `league_id=eq.${leagueId}` },
//       (payload) => appendMessageToUI(payload.new)
//     )
//     .subscribe();
//   // Remember to channel.unsubscribe() on unmount.

import { Router } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { leagueMessages, leagueMembers, users } from "../../../../lib/db/schema";
import { sendMessageSchema } from "../../../../lib/api-zod/src/knoxit-schemas";

export const chatRouter = Router();

// ---------------------------------------------------------------------------
// GET /api/leagues/:id/messages — chat history (initial load only; live
// updates after that come from the Supabase Realtime subscription, not
// repeated calls to this endpoint)
// ---------------------------------------------------------------------------

chatRouter.get("/:id/messages", async (req, res) => {
  const userId = req.userId as string;
  const leagueId = req.params.id;

  const [membership] = await db
    .select()
    .from(leagueMembers)
    .where(and(eq(leagueMembers.leagueId, leagueId), eq(leagueMembers.userId, userId)));
  if (!membership) return res.status(403).json({ error: "Not a member of this league" });

  const rows = await db
    .select({
      id: leagueMessages.id,
      leagueId: leagueMessages.leagueId,
      userId: leagueMessages.userId,
      username: users.username,
      content: leagueMessages.content,
      createdAt: leagueMessages.createdAt,
    })
    .from(leagueMessages)
    .innerJoin(users, eq(leagueMessages.userId, users.id))
    .where(eq(leagueMessages.leagueId, leagueId))
    .orderBy(asc(leagueMessages.createdAt))
    .limit(200); // TODO: paginate if leagues run long enough to need history beyond this

  res.json(rows);
});

// ---------------------------------------------------------------------------
// POST /api/leagues/:id/messages — send a message. The INSERT itself is
// what triggers the Realtime push to other subscribed clients — no extra
// broadcast code needed here.
// ---------------------------------------------------------------------------

chatRouter.post("/:id/messages", async (req, res) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const userId = req.userId as string;
  const leagueId = req.params.id;

  const [membership] = await db
    .select()
    .from(leagueMembers)
    .where(and(eq(leagueMembers.leagueId, leagueId), eq(leagueMembers.userId, userId)));
  if (!membership) return res.status(403).json({ error: "Not a member of this league" });

  const [message] = await db
    .insert(leagueMessages)
    .values({ leagueId, userId, content: parsed.data.content })
    .returning();

  res.status(201).json(message);
});
