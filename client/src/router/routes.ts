import { uuid } from "@tmw-universe/tmw-universe-types";

type Route = (params: never) => string;

export const routes = {
  HOME: () => `/`,
  EXPLORE: () => "explore",
  BOOK_PAGE: (r: { bookId: uuid }) => `/book/${r.bookId}`,
  CHAPTER_PAGE: (r: { chapterId: uuid }) => `/reader/chapter/${r.chapterId}`,
} satisfies Record<string, Route>;
