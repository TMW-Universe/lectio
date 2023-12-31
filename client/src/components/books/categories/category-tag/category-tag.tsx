import { Tag, Typography } from "antd";
import { BookCategory } from "../../../../models/books/book-category.model";
import { ColorHelper } from "../../../../utils/colors/color-helpe.util";

const { Text } = Typography;

type Props = {
  category: BookCategory;
};

export default function CategoryTag({ category: { name, id } }: Props) {
  const color = ColorHelper.fromString(id);

  return (
    <Tag color={color.toString()}>
      <Text style={{ color: color.getContrastColor().toString() }}>{name}</Text>
    </Tag>
  );
}
