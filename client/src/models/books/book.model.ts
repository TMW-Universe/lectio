import { InferType, array, date, object, string } from "yup";
import { BOOK_CATEGORY_SCHEMA } from "./book-category.model";

export const BOOK_SCHEMA = object({
  id: string().required(),
  datasourceBookId: string().required(),
  name: string().required(),
  synopsis: string().required(),
  language: string().required(),
  coverImageUrl: string().required(),
  publishedAt: date().nullable(),
  createdAt: date().required(),
  updatedAt: date().required(),
  datasourceId: string().required(),

  categories: array().of(BOOK_CATEGORY_SCHEMA),
  authors: array().of(
    object({
      id: string().required(),
      name: string().required(),
    })
  ),
});

export type Book = InferType<typeof BOOK_SCHEMA>;
