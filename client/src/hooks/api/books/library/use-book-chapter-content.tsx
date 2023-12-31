import { useQuery } from "@tanstack/react-query";
import { uuid } from "@tmw-universe/tmw-universe-types";
import { ENV } from "../../../../constants/env.constants";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { BOOK_CHAPTER_CONTENT_SCHEMA } from "../../../../models/books/book-chapter-content.model";

export default function useBookChapterContent(chapterId: uuid) {
  const { request } = useAuthenticatedRequest();

  return useQuery({
    queryKey: ["library", "books", "chapters", chapterId, "content"],
    queryFn: async () => {
      return await request(
        {
          url: `${ENV.API_HOST}/books/chapters/${chapterId}/content`,
        },
        {
          schema: BOOK_CHAPTER_CONTENT_SCHEMA,
        }
      );
    },
  });
}
