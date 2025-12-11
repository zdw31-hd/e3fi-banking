export interface Newsletter {
  title: string;
  articles: NewsletterArticle[];
}

export interface NewsletterArticle {
  title: string;
  excerpt: string;
  tag: string;
  date: string; // Using string since your format is "DD.MM.YYYY"
}