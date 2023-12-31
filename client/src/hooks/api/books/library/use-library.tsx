import { useManagedFetching } from "react-data-fetch-manager";
import { ENV } from "../../../../constants/env.constants";
import {
  BOOK_WITH_STATS_SCHEMA,
  BookWithStats,
} from "../../../../models/books/book-with-stats.model";

export function useLibrary() {
  return useManagedFetching<BookWithStats>({
    fetchOptions: {
      url: `${ENV.API_HOST}/books/list`,
    },
    schema: BOOK_WITH_STATS_SCHEMA,
  });
}
