import { InferType, array, object, string } from "yup";
import { BOOK_CHAPTER_SCHEMA } from "./book-chapter.model";

export const BOOK_CHAPTER_CONTENT_SCHEMA = object({
  chapter: BOOK_CHAPTER_SCHEMA.required(),
  images: array().of(string().required()),
  nextChapter: BOOK_CHAPTER_SCHEMA.nullable(),
  prevChapter: BOOK_CHAPTER_SCHEMA.nullable(),
});

export type BookChapterContent = InferType<typeof BOOK_CHAPTER_CONTENT_SCHEMA>;
