import { useTranslation } from "react-i18next";
import { Translations } from "../../../i18n/translations.enum";
import { Col, Row, Slider, Typography } from "antd";
import { useReaderSettings } from "../../../hooks/reader/settings/use-reader-settings";

const { Text } = Typography;

export default function ReaderUtilities() {
  const { t } = useTranslation([Translations.BOOK_READER]);

  const { readerSettings, setReaderSettings } = useReaderSettings();

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Text>{t("reader-utils.utilities.images-size.Text")} (%)</Text>
        <Slider
          defaultValue={readerSettings.imagesSize}
          onChange={(v) =>
            setReaderSettings({ ...readerSettings, imagesSize: v })
          }
          max={100}
          min={1}
        />
      </Col>
    </Row>
  );
}
