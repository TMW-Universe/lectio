import { useQuery } from "@tanstack/react-query";
import { ENV } from "../../../../constants/env.constants";
import { usePagination } from "react-data-fetch-manager";
import { useEffect, useState } from "react";
import { PaginatedResponse } from "react-data-fetch-manager/dist/types/data-fetching/paginated-response.type";
import { BookExplorerFilters } from "../../../../components/books/explorer/filters/book-explorer-filters";
import { useAuthenticatedRequest } from "../../../network/use-authenticated-request";
import { BookExplorerItem } from "../../../../models/book-explorer/book-explorer-item.model";

type Filter = BookExplorerFilters;

export function useCatalogExplorer() {
  const { request } = useAuthenticatedRequest();

  const [filters, setFilters] = useState<Filter>({});

  const canRequest = filters.name && filters.datasourceId;

  const pagination = usePagination();
  const query = useQuery({
    queryKey: ["api", "catalog", "explore", { filters, pagination }],
    queryFn: async () =>
      canRequest
        ? (
            await request<PaginatedResponse<BookExplorerItem>>({
              method: "get",
              url: `${ENV.API_HOST}/catalog/explore`,
              params: {
                page: pagination.currentPage + 1,
                ...filters,
              },
            })
          ).data
        : { count: 0, rows: [] },
  });

  useEffect(() => {
    if (query.data) pagination.setTotal(query.data.count);
  }, [pagination, query.data, query.data?.count]);

  useEffect(() => {
    if (filters.datasourceId) query.refetch();
  }, [filters.datasourceId, query]);

  return {
    query,
    pagination,
    filters,
    setFilters,
  };
}
