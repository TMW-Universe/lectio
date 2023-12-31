import { useTwmuAccount } from "@tmw-universe/react-tmw-universe-authentication-utils";
import LibraryExplorer from "../components/books/library/library-explorer";

export default function HomePage() {
  const { isAuthenticated } = useTwmuAccount();

  return <>{isAuthenticated && <LibraryExplorer />}</>;
}
