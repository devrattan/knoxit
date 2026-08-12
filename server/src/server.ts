import express from "express";
import cors from "cors";
import "./types";
import { accountRouter } from "./routes/account";
import { chatRouter } from "./routes/chat";
import { friendsLeaguesRouter } from "./routes/friendsLeagues";
import { leaguesRouter } from "./routes/leagues";
import { picksRouter } from "./routes/picks";
import { shopRouter } from "./routes/shop";
import { splitVoteRouter } from "./routes/splitVote";
import { standingsRouter } from "./routes/standings";
import { attachUser } from "./middleware/auth";
import { authRouter } from "./routes/auth";

export function createServer() {
  const app = express();

  const allowedOrigins = (process.env.APP_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed"));
    }
  }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.get("/api/session", attachUser, (req, res) => res.json({ user: req.authUser }));

  app.use("/api/account", attachUser, accountRouter);
  app.use("/api/friends-leagues", attachUser, friendsLeaguesRouter);
  app.use("/api/leagues", attachUser, chatRouter);
  app.use("/api/leagues", attachUser, splitVoteRouter);
  app.use("/api/leagues", attachUser, leaguesRouter);
  app.use("/api/picks", attachUser, picksRouter);
  app.use("/api/shop", attachUser, shopRouter);
  app.use("/api/split-vote", attachUser, splitVoteRouter);
  app.use("/api/standings", attachUser, standingsRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  });

  return app;
}
