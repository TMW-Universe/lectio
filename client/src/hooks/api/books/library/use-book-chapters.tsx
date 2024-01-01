import { useQuery } from "@tanstack/react-query";
import { uuid } from "@tmw-universe/tmw-universe-types";
import { ENV } from "../../../../constants/env.constants";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { array, object, string } from "yup";
import { BOOK_CHAPTER_SCHEMA } from "../../../../models/books/book-chapter.model";

export default function useBookChapters(bookId: uuid) {
  const { request } = useAuthenticatedRequest();

  return useQuery({
    queryKey: ["library", "book", bookId, "chapters"],
    queryFn: async () => {
      return await request(
        {
          url: `${ENV.API_HOST}/books/${bookId}/chapters`,
        },
        {
          schema: object({
            chapters: array().of(
              BOOK_CHAPTER_SCHEMA.shape({
                UserEndedChapters: array()
                  .of(
                    object({
                      id: string().required(),
                    })
                  )
                  .required(),
              })
            ),
          }),
        }
      );
    },
  });
}
