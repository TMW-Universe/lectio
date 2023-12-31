import { Badge, Card, Flex, Spin, Typography } from "antd";
import { BookExplorerItem } from "../../../../models/book-explorer/book-explorer-item.model";
import { useState } from "react";
import styles from "./explorer-book-item.module.pcss";
import { useTranslation } from "react-i18next";
import { Translations } from "../../../../i18n/translations.enum";
import classNames from "classnames";

const { Text } = Typography;

type Props = {
  book: BookExplorerItem;
  onAddBook?: (book: BookExplorerItem) => Promise<void>;
};

export default function ExplorerBookItem({ book, onAddBook }: Props) {
  const { coverUrl, name, isAdded } = book;

  const { t } = useTranslation([Translations.BOOKS_CATALOG_EXPLORER]);

  const [isLoading, setLoading] = useState(false);

  const CardContent = () => (
    <Card
      className={classNames(isAdded && styles["is-added"])}
      hoverable={!isLoading && !isAdded}
      bodyStyle={{ padding: 0 }}
      onClick={
        onAddBook
          ? async () => {
              setLoading(true);
              try {
                await onAddBook(book);
              } finally {
                setLoading(false);
              }
            }
          : undefined
      }
    >
      <Flex vertical gap="1em">
        <div className={styles.cover}>
          <img src={coverUrl} alt={`Cover for ${name}`} />
          {isLoading && <Spin className={styles.loading} />}
        </div>
        <Text className={styles.title}>{name}</Text>
      </Flex>
    </Card>
  );

  if (isAdded)
    return (
      <Badge.Ribbon text={t("book-item.Is-added")}>
        <CardContent />
      </Badge.Ribbon>
    );

  return <CardContent />;
}
