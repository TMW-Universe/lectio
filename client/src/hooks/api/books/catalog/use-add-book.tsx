import { useMutation } from "@tanstack/react-query";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { BookDatasource } from "../../../../models/book-datasources/book-datasource.model";
import { ENV } from "../../../../constants/env.constants";
import { Book } from "../../../../models/books/book.model";

export function useAddBook() {
  const { request } = useAuthenticatedRequest();

  return useMutation({
    mutationKey: ["api", "catalog", "add-book"],
    mutationFn: async ({
      bookCode,
      bookDatasource,
    }: {
      bookDatasource: BookDatasource;
      bookCode: string;
    }) =>
      await request<Book>({
        url: `${
          ENV.API_HOST
        }/catalog/add-book/${bookDatasource}/${encodeURIComponent(bookCode)}`,
      }),
  });
}
