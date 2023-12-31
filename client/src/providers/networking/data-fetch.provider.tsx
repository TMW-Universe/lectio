import { QueryClient } from "@tanstack/react-query";
import { Col, Pagination, Row, Spin } from "antd";
import Search from "antd/es/input/Search";
import { useTransition } from "react";
import { DataFetchingService } from "react-data-fetch-manager";
import DFP from "react-data-fetch-manager/dist/providers/data-fetch.provider";
import { useTwmuAccount } from "@tmw-universe/react-tmw-universe-authentication-utils";

export type Props = {
  children: JSX.Element | JSX.Element[];
  queryClient: QueryClient;
};

export default function DataFetchProvider({ children, queryClient }: Props) {
  const [, startTransition] = useTransition();

  const { accessToken } = useTwmuAccount();

  const fetchingService = DataFetchingService.fromFactory(async (options) => {
    return {
      ...options,
      options: {
        ...options?.options,
        headers: {
          ...options?.options?.headers,
          authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      },
    };
  });

  return (
    <DFP
      services={{ default: fetchingService }}
      defaultService="default"
      queryClient={queryClient}
      overrideUIComponents={{
        search: (options) => (
          <Search
            disabled={options.disabled}
            loading={options.loading}
            value={options.value}
            defaultValue={options.defaultValue}
            placeholder={options.placeholder}
            onSearch={options.onSearch}
          />
        ),
        pagination: ({ pagination }) => (
          <Pagination
            pageSize={pagination.pageSize}
            total={pagination.total}
            current={pagination.currentPage + 1}
            onChange={(currentPage, pageSize) => {
              startTransition(() => {
                if (pagination.currentPage + 1 !== currentPage)
                  pagination.setCurrentPage(currentPage - 1);
                if (pagination.pageSize !== pageSize)
                  pagination.setPageSize(pageSize);
              });
            }}
          />
        ),
        layout: (options) => (
          <Row gutter={[12, 12]}>
            <Col span={24}>
              {<options.Filters managedFetch={options.managedFetch} />}
            </Col>
            <Col span={24}>
              {options.managedFetch.useQueryInstance.isFetching ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <options.Loading />
                </div>
              ) : (
                <options.Content />
              )}
            </Col>
            <Col span={24}>
              <options.Pagination />
            </Col>
          </Row>
        ),
        loading: () => <Spin />,
      }}
    >
      {children}
    </DFP>
  );
}
