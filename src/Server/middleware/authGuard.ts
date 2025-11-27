import { RequestHandler } from "express";

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};
