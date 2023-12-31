import { InferType, number, object } from "yup";
import { BOOK_SCHEMA } from "./book.model";

export const BOOK_WITH_STATS_SCHEMA = BOOK_SCHEMA.shape({
  stats: object({
    chaptersCount: number().required(),
    userReadChaptersCount: number().required(),
  }),
});

export type BookWithStats = InferType<typeof BOOK_WITH_STATS_SCHEMA>;
