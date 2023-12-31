import { Select } from "antd";
import { useBookDatasources } from "../../../hooks/api/books/datasources/use-book-datasources";

type Props = {
  onValueChange: (value: string) => void;
};

export default function BookDatasourceSelect({ onValueChange }: Props) {
  const { data, isLoading, isFetching } = useBookDatasources();

  return (
    <Select<string>
      onChange={onValueChange}
      style={{ width: "100%" }}
      loading={isLoading}
      disabled={isFetching}
      options={data?.map(({ name, id }) => ({
        label: name,
        value: id,
      }))}
    />
  );
}
