import styles from "./route.layout.module.pcss";

type Props = {
  children: JSX.Element;
};

export default function RouteLayout({ children }: Props) {
  return <div className={styles.route}>{children}</div>;
}
