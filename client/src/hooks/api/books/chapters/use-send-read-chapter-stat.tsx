import { useMutation } from "@tanstack/react-query";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { uuid } from "@tmw-universe/tmw-universe-types";
import { ENV } from "../../../../constants/env.constants";

export function useSendReadChapterStat() {
  const { request } = useAuthenticatedRequest();

  return useMutation({
    mutationKey: ["books", "chapters", "finished"],
    mutationFn: async (chapterId: uuid) =>
      await request({
        url: `${ENV.API_HOST}/books/chapters/${chapterId}/finished`,
        method: "post",
      }),
  });
}
