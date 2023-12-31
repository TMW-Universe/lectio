import { Col, Row } from "antd";
import BookDatasourceSelect from "../../datasources/book-datasource-select";
import BookExplorerNameFilter from "./fields/book-explorer-name-filter";
import { BookDatasource } from "../../../../models/book-datasources/book-datasource.model";

type Props = {
  filters: BookExplorerFilters;
  setFilters: (filters: BookExplorerFilters) => void;
};

export type BookExplorerFilters = {
  name?: string;
  datasourceId?: BookDatasource;
};

export default function BookExplorerFilters({ setFilters, filters }: Props) {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={6}>
        <BookDatasourceSelect
          onValueChange={(datasourceId) => {
            setFilters({
              ...filters,
              datasourceId: datasourceId as unknown as BookDatasource,
            });
          }}
        />
      </Col>
      <Col xs={24} md={18}>
        <BookExplorerNameFilter
          onSearch={(name) => setFilters({ ...filters, name })}
        />
      </Col>
    </Row>
  );
}
