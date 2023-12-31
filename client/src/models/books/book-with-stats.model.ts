import { InferType, number, object, string } from "yup";
import { BOOK_SCHEMA } from "./book.model";

export const BOOK_WITH_STATS_SCHEMA = BOOK_SCHEMA.shape({
  stats: object({
    chaptersCount: number().required(),
    userReadChaptersCount: number().required(),
    nextChapterId: string().nullable(),
  }),
});

export type BookWithStats = InferType<typeof BOOK_WITH_STATS_SCHEMA>;
