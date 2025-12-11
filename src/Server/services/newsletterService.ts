import { Newsletter } from "../models/newsletter";

export class NewsletterService{

  public addNewsAboForUser():void{
      let email = "not yet implemented";
      console.log("Account registeren for newsletter notifications with mail: " + email);
  }

  public getNewsletter(): Newsletter {
    return {
      title: "Newsletter",
      articles: [
        {
          title: "Neue Sicherheitsfunktionen im Online-Banking",
          excerpt: "Biometrische Anmeldung und KI-Betrugsschutz – so bleibt Ihr Konto sicher.",
          tag: "Sicherheit",
          date: "20.11.2025"
        },
        {
          title: "Zinsupdate für Sparkonten",
          excerpt: "Was die aktuellen Leitzinsen für Ihre Ersparnisse bedeuten.",
          tag: "Finanzen",
          date: "18.11.2025"
        },
        {
          title: "Kontaktlos bezahlen leicht gemacht",
          excerpt: "So nutzen Sie Ihre Karte oder Ihr Smartphone sicher und bequem.",
          tag: "Digital Banking",
          date: "15.11.2025"
        }
      ]
    };
  }


}