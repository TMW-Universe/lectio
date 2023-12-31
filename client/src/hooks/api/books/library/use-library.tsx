import { useManagedFetching } from "react-data-fetch-manager";
import { ENV } from "../../../../constants/env.constants";
import { Book } from "../../../../models/books/book.model";

export function useLibrary() {
  return useManagedFetching<Book>({
    fetchOptions: {
      url: `${ENV.API_HOST}/books/list`,
    },
  });
}
