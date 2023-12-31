import { Button, Col, Row } from "antd";
import styles from "./chapter-reader-footer.module.pcss";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { BookChapter } from "../../../models/books/book-chapter.model";
import { useMarkChapterAsRead } from "../../../hooks/reader/stats/use-mark-chapter-as-read";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { uuid } from "@tmw-universe/tmw-universe-types";
import { Translations } from "../../../i18n/translations.enum";
import { routes } from "../../../router/routes";
import useNotification from "antd/es/notification/useNotification";

type Props = {
  nextChapter?: BookChapter | null;
  prevChapter?: BookChapter | null;
  chapter: BookChapter;
};

export default function ChapterReaderFooter({
  nextChapter,
  prevChapter,
  chapter,
}: Props) {
  const { t } = useTranslation([Translations.BOOK_READER]);
  const [markedAsReadNotification, markedAsReadContext] = useNotification({});

  const navigate = useNavigate();

  const { markChapterAsRead } = useMarkChapterAsRead();

  const navigateToChapter = async (chapterId: uuid) => {
    await markChapterAsRead(chapter.id);
    navigate(routes.CHAPTER_PAGE({ chapterId }));
  };

  return (
    <>
      {markedAsReadContext}
      <Row gutter={[12, 12]} justify="center" className={styles.footer}>
        <Col xs={24} md={12}>
          <Button
            disabled={!prevChapter}
            icon={<ArrowLeftOutlined />}
            block
            onClick={() => {
              if (prevChapter) {
                navigateToChapter(prevChapter.id);
              }
            }}
          >
            {t("fast-nav.Prev-chapter")}
            {prevChapter && ` (${prevChapter.name})`}
          </Button>
        </Col>
        <Col xs={24} md={12}>
          <Button
            disabled={!nextChapter}
            type="primary"
            icon={<ArrowRightOutlined />}
            block
            onClick={() => {
              if (nextChapter) {
                navigateToChapter(nextChapter.id);
              }
            }}
          >
            {t("fast-nav.Next-chapter")}
            {nextChapter && ` (${nextChapter.name})`}
          </Button>
        </Col>
        <Col xs={24} md={12}>
          <Button
            icon={<CheckOutlined />}
            block
            onClick={async () => {
              await markChapterAsRead(chapter.id);
              markedAsReadNotification.success({
                message: t("indicators.marked-as-read.Text"),
              });
            }}
          >
            {t("fast-nav.Mark-chapter-as-read")}
          </Button>
        </Col>
      </Row>
    </>
  );
}
