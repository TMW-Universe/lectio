import { Col, Flex, Pagination, Row } from "antd";
import BookExplorerFilters from "./filters/book-explorer-filters";
import classNames from "classnames";
import styles from "./book-explorer.module.pcss";
import { useCatalogExplorer } from "../../../hooks/api/books/catalog/use-catalog-explorer";
import ExplorerBookItem from "./book-item/explorer-book-item";
import { useTransition } from "react";
import { useAddBook } from "../../../hooks/api/books/catalog/use-add-book";

export default function BookExplorer() {
  const {
    setFilters,
    filters,
    query: { data },
    pagination,
  } = useCatalogExplorer();

  const [, startTransition] = useTransition();

  const { mutate: addBook } = useAddBook();

  return (
    <Flex vertical gap="2em" className={styles.container}>
      <div className={classNames("flex justify-center w-full")}>
        <div className={styles.filters}>
          <BookExplorerFilters setFilters={setFilters} filters={filters} />
        </div>
      </div>
      <div className={styles.results}>
        <Row gutter={[12, 12]}>
          {data?.rows?.map((book) => (
            <Col key={book.code} xs={12} md={8} xl={6}>
              <ExplorerBookItem
                onAddBook={async ({ code: bookCode }) => {
                  if (filters.datasourceId)
                    await addBook({
                      bookCode,
                      bookDatasource: filters.datasourceId,
                    });
                }}
                book={book}
              />
            </Col>
          ))}
        </Row>
      </div>
      <div className={styles.pagination}>
        <Pagination
          pageSize={pagination.pageSize}
          onChange={(currentPage, pageSize) => {
            startTransition(() => {
              if (pagination.currentPage !== currentPage - 1)
                pagination.setCurrentPage(currentPage - 1);
              if (pagination.pageSize !== pageSize)
                pagination.setPageSize(pageSize);
            });
          }}
          total={pagination.total}
          current={pagination.currentPage + 1}
          pageSizeOptions={[]}
          defaultPageSize={20}
        />
      </div>
    </Flex>
  );
}
