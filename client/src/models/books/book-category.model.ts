import { InferType, date, object, string } from "yup";

export const BOOK_CATEGORY_SCHEMA = object({
  id: string().required(),
  name: string().required(),
  createdAt: date().required(),
});

export type BookCategory = InferType<typeof BOOK_CATEGORY_SCHEMA>;
