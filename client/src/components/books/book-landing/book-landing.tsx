import { Language, uuid } from "@tmw-universe/tmw-universe-types";
import useBook from "../../../hooks/api/books/library/use-book";
import { Col, Flex, Image, Row, Skeleton, Typography } from "antd";
import styles from "./book-landing.module.pcss";
import CategoryTag from "../categories/category-tag/category-tag";
import useBookChapters from "../../../hooks/api/books/library/use-book-chapters";
import ChaptersList from "../chapters/list/chapters-list";
import LanguageFlag from "../../common/country-flag/language-flag";
import BookRescanButton from "./rescan/book-rescan-button";

const { Title, Text } = Typography;

type Props = {
  bookId: uuid;
};

export default function BookLanding({ bookId }: Props) {
  const { data } = useBook(bookId);
  const { data: chaptersData } = useBookChapters(bookId);

  const book = data?.data;
  const bookChapters = chaptersData?.data.chapters;

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8} xl={6} className={styles.cover}>
        <Image
          rootClassName={styles["cover-image-container"]}
          height="30em"
          src={book?.coverImageUrl}
          alt={`Cover for ${book?.name}`}
        />
      </Col>
      <Col xs={24} md={16} xl={18}>
        <Flex>
          <div>
            <Title className={styles.title}>
              {book?.language && (
                <LanguageFlag
                  className={styles.language}
                  language={book.language as Language}
                />
              )}{" "}
              {book?.name}
            </Title>
            <div className={styles.synopsis}>
              {book ? <Text>{book.synopsis}</Text> : <Skeleton />}
            </div>
          </div>
          <div>
            <BookRescanButton bookId={bookId} />
          </div>
        </Flex>
      </Col>
      <Col span={24}>
        <div className={styles.categories}>
          {book?.categories?.map((category) => (
            <CategoryTag category={category} key={category.id} />
          ))}
        </div>
      </Col>
      <Col span={24}>
        {bookChapters ? <ChaptersList chapters={bookChapters} /> : <Skeleton />}
      </Col>
    </Row>
  );
}
