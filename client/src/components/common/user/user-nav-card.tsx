import {
  getFullName,
  getProfilePictureUrl,
  useTmwuAuthentication,
  useTwmuAccount,
} from "@tmw-universe/react-tmw-universe-authentication-utils";
import { Avatar, Button, Flex, Popover, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Translations } from "../../../i18n/translations.enum";
import { LogoutOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function UserNavCard() {
  const { isAuthenticated, account } = useTwmuAccount();

  if (!isAuthenticated) throw new Error();

  return (
    <Popover placement="bottom" content={<PopoverContent />}>
      <Flex align="center" justify="center" gap="1em">
        <Avatar src={getProfilePictureUrl(account)} />
        <Text>{getFullName(account)}</Text>
      </Flex>
    </Popover>
  );
}

const PopoverContent = () => {
  const { t } = useTranslation([Translations.TMWU_AUTH]);

  const { logout } = useTmwuAuthentication();

  return (
    <Flex>
      <Button
        icon={<LogoutOutlined />}
        style={{ width: "10em" }}
        type="primary"
        onClick={() => logout()}
      >
        {t("logout.button.Text")}
      </Button>
    </Flex>
  );
};
