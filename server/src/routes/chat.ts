// artifacts/api-server/src/routes/chat.ts
//
// These REST routes own authorized history reads and message inserts in Neon.
// Live delivery is a separate pending feature and should be implemented by
// the Express service using authenticated WebSocket rooms or SSE streams.

import { Router } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db } from "@db/index";
import { leagueMessages, leagueMembers, users } from "@db/schema";
import { sendMessageSchema } from "@api-zod/knoxit-schemas";

export const chatRouter = Router();

// ---------------------------------------------------------------------------
// GET /api/leagues/:id/messages — authorized chat history.
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
