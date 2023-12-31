import { uuid } from "@tmw-universe/tmw-universe-types";
import { Button, Col, Row, Spin, Typography } from "antd";
import useBookChapterContent from "../../../hooks/api/books/library/use-book-chapter-content";
import { useEffect } from "react";
import useNotification from "antd/es/notification/useNotification";
import styles from "./chapter-reader.module.pcss";
import { useTranslation } from "react-i18next";
import { Translations } from "../../../i18n/translations.enum";
import { isMobile } from "../../../utils/device/is-mobile.util";
import { useDoubleTap } from "../../../hooks/screen/use-double-tap";
import useModal from "antd/es/modal/useModal";
import ReaderUtilities from "../reader-utilities/reader-utilities";
import { useReaderSettings } from "../../../hooks/reader/settings/use-reader-settings";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../router/routes";
import { useMarkChapterAsRead } from "../../../hooks/reader/stats/use-mark-chapter-as-read";

const { Title, Text } = Typography;

type Props = {
  chapterId: uuid;
};

export default function ChapterReader({ chapterId }: Props) {
  const { t } = useTranslation([Translations.BOOK_READER]);
  const navigate = useNavigate();

  const { data, isLoading } = useBookChapterContent(chapterId);

  const { markChapterAsRead } = useMarkChapterAsRead();

  // Variables
  const images = data?.data.images;
  const chapter = data?.data.chapter;
  const nextChapter = data?.data.nextChapter;
  const prevChapter = data?.data.prevChapter;

  // Reader utilities
  const [notification, notificationContext] = useNotification();
  const [modal, modalContext] = useModal();

  const { readerSettings } = useReaderSettings();

  const navigateToChapter = async (chapterId: uuid) => {
    await markChapterAsRead(chapterId);
    navigate(routes.CHAPTER_PAGE({ chapterId }));
  };

  const showReaderTools = () => {
    modal.info({
      content: <ReaderUtilities />,
      title: t("reader-utils.utilities.Title"),
      footer: null,
      closable: true,
    });
  };

  useEffect(() => {
    notification.destroy();
    notification.info({
      message: (
        <Text>
          {t(
            `reader-utils.notification.${
              isMobile() ? "mobile" : "desktop"
            }.Text`
          )}
        </Text>
      ),
      duration: 5,
    });
  }, [notification, t]);

  useDoubleTap({ onDoubleTap: showReaderTools });

  useEffect(() => {
    const event = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") showReaderTools();
    };
    window.addEventListener("keydown", event);
    return () => removeEventListener("keydown", event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {notificationContext}
      {modalContext}
      {isLoading ? (
        <Row justify="center">
          <Col>
            <Spin />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col className={styles.info} span={24}>
            <Title level={2}>{chapter?.name}</Title>
          </Col>
          {images?.map((image, i) => (
            <Col span={24} className={styles["image-container"]} key={i}>
              <img
                loading="lazy"
                alt="Chapter image"
                style={{ width: `${readerSettings.imagesSize}%` }}
                src={image}
              />
            </Col>
          ))}
          <Col span={24} className={styles.footer}>
            <Row gutter={[12, 12]}>
              <Col span={12}>
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
              <Col span={12}>
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
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
}
