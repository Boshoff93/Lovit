import data from "./blog.json";
export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  code?: { language: string; value: string };
  links?: { label: string; href: string }[];
}
export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  art: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  takeaways: string[];
  sections: GuideSection[];
  related: string[];
}
export const blogPosts: Guide[] = data;
export function guideMinutes(guide: Guide): number {
  return Math.max(
    1,
    Math.ceil(
      guide.sections
        .flatMap((section) => section.paragraphs)
        .join(" ")
        .split(/\s+/).length / 200,
    ),
  );
}
export function guideDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(new Date(date));
}
