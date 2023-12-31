import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { Translations } from "../../../i18n/translations.enum";
import { useTmwuAuthentication } from "@tmw-universe/react-tmw-universe-authentication-utils";

export default function LoginButton() {
  const { t } = useTranslation([Translations.TMWU_AUTH]);

  const { login, isAuthenticating } = useTmwuAuthentication();

  return (
    <Button onClick={() => login()} loading={isAuthenticating}>
      {t("login.button.Text")}
    </Button>
  );
}
