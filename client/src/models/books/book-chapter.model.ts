import { InferType, number, object, string } from "yup";

export const BOOK_CHAPTER_SCHEMA = object({
  id: string().required(),
  code: string().required(),
  name: string().required(),
  number: number().required(),
  bookId: string().required(),
});

export type BookChapter = InferType<typeof BOOK_CHAPTER_SCHEMA>;
