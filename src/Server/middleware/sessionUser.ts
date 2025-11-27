import { RequestHandler } from "express";

export const attachUserToLocals: RequestHandler = (req, res, next) => {
  res.locals.user = req.session.user ?? null;
  next();
};
