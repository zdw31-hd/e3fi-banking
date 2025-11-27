import { Request, Response } from "express";

export class PageController {
  public landing = (_req: Request, res: Response): void => {
    res.render("index");
  };
}
