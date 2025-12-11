import { Request, Response } from "express";
import { toAccountViewModel } from "../models/account";
import { NewsletterService } from "../services/newsletterService";

export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  public renderNewsletter = (req: Request, res: Response): void => {
    const user = req.session.user!;
    const newsletter = this.newsletterService.getNewsletter();
    res.render("newsletter", { user, newsletter, message: null, error: null, success :null });
  };

}
