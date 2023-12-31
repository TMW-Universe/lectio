import { useMutation } from "@tanstack/react-query";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { EndedChapterDBModel } from "../../../../db/models/offline-chapters-info/ended-chapter.db-model";
import { ENV } from "../../../../constants/env.constants";

export function useSyncReadChapters() {
  const { request } = useAuthenticatedRequest();

  return useMutation({
    mutationKey: ["books", "chapters", "sync-ended-chapters"],
    mutationFn: async (chapters: EndedChapterDBModel[]) =>
      await request({
        url: `${ENV.API_HOST}/books/chapters/sync-ended-chapters`,
        method: "post",
        data: {
          chapters,
        },
      }),
  });
}
