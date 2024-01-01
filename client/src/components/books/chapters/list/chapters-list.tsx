import { Card, Col, Row, Typography } from "antd";
import { BookChapter } from "../../../../models/books/book-chapter.model";
import { gold, green } from "@ant-design/colors";
import styles from "./chapters-list.module.pcss";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../router/routes";
import { uuid } from "@tmw-universe/tmw-universe-types";
import ChaptersListIndex from "./index/chapters-list-index";

const { Title, Text } = Typography;

type Props = {
  chapters: (BookChapter & { UserEndedChapters: { id: uuid }[] })[];
};

export default function ChaptersList({ chapters: rawChapters }: Props) {
  const chapters = rawChapters.sort((a, b) => (a.number > b.number ? 1 : -1));

  const navigate = useNavigate();

  const onChapterClick = (chapterId: uuid) => {
    navigate(routes.CHAPTER_PAGE({ chapterId }));
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ChaptersListIndex chapters={chapters} />
      </Col>
      {chapters.map((chapter) => (
        <Col
          span={24}
          key={chapter.id}
          id={`_chapter_list_item_${chapter.number}`}
        >
          <Card
            hoverable
            role="button"
            aria-description={`Go to chapter ${chapter.name}`}
            onClick={() => onChapterClick(chapter.id)}
          >
            <div className={styles.chapter}>
              <div
                className={styles.number}
                style={{
                  backgroundColor:
                    chapter.UserEndedChapters.length > 0 ? green[3] : gold[3],
                }}
              >
                <Text>{chapter.number}</Text>
              </div>
              <Title level={4}>{chapter.name}</Title>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
