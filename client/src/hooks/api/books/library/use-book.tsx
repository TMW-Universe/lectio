import { useQuery } from "@tanstack/react-query";
import { uuid } from "@tmw-universe/tmw-universe-types";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { ENV } from "../../../../constants/env.constants";
import { BOOK_SCHEMA } from "../../../../models/books/book.model";

export default function useBook(bookId: uuid) {
  const { request } = useAuthenticatedRequest();

  return useQuery({
    queryKey: ["library", "book", bookId],
    queryFn: async () => {
      return await request(
        {
          url: `${ENV.API_HOST}/books/${bookId}`,
        },
        {
          schema: BOOK_SCHEMA,
        }
      );
    },
  });
}
