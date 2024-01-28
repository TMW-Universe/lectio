import { ReloadOutlined } from "@ant-design/icons";
import { uuid } from "@tmw-universe/tmw-universe-types";
import { Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { Translations } from "../../../../i18n/translations.enum";
import { useBookRescan } from "../../../../hooks/api/books/catalog/use-book-rescan";
import useNotification from "antd/es/notification/useNotification";
import { AxiosError } from "axios";

type Props = {
  bookId: uuid;
};

export default function BookRescanButton({ bookId }: Props) {
  const { t } = useTranslation([Translations.BOOK_LANDING]);

  const [notificationApi, notificationContext] = useNotification();
  const { isPending, mutateAsync } = useBookRescan();

  const rescan = async () => {
    try {
      await mutateAsync(bookId);
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.status === 403 || error.response?.status === 429)
        notificationApi.error({
          message: t("actions.rescan.too-many-requests.Message"),
        });
    }
  };

  return (
    <>
      {notificationContext}
      <Popover title={t("actions.rescan.Description")}>
        <Button
          loading={isPending}
          disabled={isPending}
          onClick={rescan}
          icon={<ReloadOutlined />}
        >
          {t("actions.rescan.Text")}
        </Button>
      </Popover>
    </>
  );
}
