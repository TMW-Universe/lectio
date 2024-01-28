import { useMutation } from "@tanstack/react-query";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { uuid } from "@tmw-universe/tmw-universe-types";
import { ENV } from "../../../../constants/env.constants";

export function useBookRescan() {
  const { request } = useAuthenticatedRequest();

  return useMutation({
    mutationKey: ["api", "catalog", "rescan"],
    mutationFn: async (bookId: uuid) =>
      await request({
        url: `${ENV.API_HOST}/catalog/rescan/${encodeURIComponent(bookId)}`,
        method: "post",
      }),
  });
}
