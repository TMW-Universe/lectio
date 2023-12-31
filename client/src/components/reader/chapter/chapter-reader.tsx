import { uuid } from "@tmw-universe/tmw-universe-types";
import { Col, Row, Spin, Typography } from "antd";
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
import ChapterReaderFooter from "./chapter-reader-footer";

const { Title, Text } = Typography;

type Props = {
  chapterId: uuid;
};

export default function ChapterReader({ chapterId }: Props) {
  const { t } = useTranslation([Translations.BOOK_READER]);

  const { data, isLoading } = useBookChapterContent(chapterId);

  // Variables
  const images = data?.data.images;
  const chapter = data?.data.chapter;
  const nextChapter = data?.data.nextChapter;
  const prevChapter = data?.data.prevChapter;

  // Reader utilities
  const [notification, notificationContext] = useNotification();
  const [modal, modalContext] = useModal();

  const { readerSettings } = useReaderSettings();

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
          {chapter && (
            <Col span={24}>
              <ChapterReaderFooter
                nextChapter={nextChapter}
                prevChapter={prevChapter}
                chapter={chapter}
              />
            </Col>
          )}
        </Row>
      )}
    </>
  );
}
