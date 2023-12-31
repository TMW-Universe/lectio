import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { ENV } from "../../../../constants/env.constants";
import { BookDatasource } from "../../../../models/book-datasources/book-datasource.model";
import { date, object } from "yup";

const schema = object({
  createdAt: date().required(),
});

export function useBookDatasources() {
  const { request } = useAuthenticatedRequest();
  return useQuery({
    queryKey: ["datasources", "list"],
    queryFn: async () =>
      (
        await request<BookDatasource[]>({
          method: "get",
          url: `${ENV.API_HOST}/datasources/list`,
        })
      ).data.map((ds) => schema.cast(ds)) as BookDatasource[],
  });
}
