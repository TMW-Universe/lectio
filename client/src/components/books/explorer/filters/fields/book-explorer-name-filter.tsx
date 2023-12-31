import Search from "antd/es/input/Search";

type Props = {
  onSearch: (name: string) => void;
};

export default function BookExplorerNameFilter({ onSearch }: Props) {
  return <Search onSearch={(v) => onSearch(v)} />;
}
