import type { RequestHandler } from "express";

const demoUserId = "00000000-0000-4000-8000-000000000001";

export const attachUser: RequestHandler = (req, _res, next) => {
  req.userId = req.header("x-knoxit-user-id") || demoUserId;
  next();
};
