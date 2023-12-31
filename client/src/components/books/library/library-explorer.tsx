import { Col, Row } from "antd";
import { useLibrary } from "../../../hooks/api/books/library/use-library";
import LibraryBookItem from "./book-item/library-book-item";
import ManagedFetchRenderer from "react-data-fetch-manager/dist/components/renderers/managed-fetch-renderer";

export default function LibraryExplorer() {
  const managedFetch = useLibrary();

  return (
    <ManagedFetchRenderer
      render={({ rows }) => (
        <Row gutter={[12, 12]} justify="center">
          {rows.map((book) => (
            <Col key={book.id} xs={12} lg={8} xl={4}>
              <LibraryBookItem book={book} />
            </Col>
          ))}
        </Row>
      )}
      managedFetch={managedFetch}
    />
  );
}
