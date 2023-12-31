import { Layout, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { Translations } from "../../i18n/translations.enum";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";
import classNames from "classnames";
import Authenticated from "@tmw-universe/react-tmw-universe-authentication-utils/dist/components/authenticated";
import UserNavCard from "../../components/common/user/user-nav-card";
import NotAuthenticated from "@tmw-universe/react-tmw-universe-authentication-utils/dist/components/not-authenticated";
import LoginButton from "../../components/common/user/login-button";
import styles from "./navigation.layout.module.pcss";
import { useTheme } from "../../providers/theming/theme.provider";
import { Theme } from "@tmw-universe/tmw-universe-types";
import { useNetworkStatus } from "../../hooks/network/use-network-status";
import { useTwmuAccount } from "@tmw-universe/react-tmw-universe-authentication-utils";

type Props = {
  children?: JSX.Element | JSX.Element[];
};

export default function NavigationLayout({ children }: Props) {
  const { t } = useTranslation([Translations.LAYOUT]);
  const navigate = useNavigate();

  const { isOnline } = useNetworkStatus();
  const { isAuthenticated } = useTwmuAccount();

  const basicItems = [
    {
      label: t("navigation.pages.Home"),
      key: "home",
      route: routes.HOME(),
    },
  ];

  const onlineItems =
    isOnline && isAuthenticated
      ? [
          {
            label: t("navigation.pages.Explore"),
            key: "explore",
            route: routes.EXPLORE(),
          },
        ]
      : [];

  const { theme } = useTheme();

  return (
    <Layout className={styles.layout}>
      <Header
        style={
          theme.theme === Theme.LIGHT ? { backgroundColor: "white" } : undefined
        }
      >
        <div className={classNames("container mx-auto", styles.header)}>
          <Menu
            theme={theme.theme}
            mode="horizontal"
            items={[...basicItems, ...onlineItems].map(
              ({ route, ...item }) => ({
                ...item,
                onClick: () => navigate(route),
              })
            )}
            className={styles.menu}
          />
          <div className={styles.user}>
            <Authenticated>
              <UserNavCard />
            </Authenticated>
            <NotAuthenticated>
              <LoginButton />
            </NotAuthenticated>
          </div>
        </div>
      </Header>
      <div className={classNames("container mx-auto", styles.content)}>
        {children}
      </div>
    </Layout>
  );
}
