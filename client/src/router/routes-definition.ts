import { Route } from "./router";
import { routes } from "./routes";

const routes_definition: Route[] = [
  {
    path: routes.HOME(),
    loader: () => import("../pages/home.page"),
    allowsOffline: true,
  },
  {
    path: routes.EXPLORE(),
    loader: () => import("../pages/books/book-explorer.page"),
  },
  {
    path: routes.BOOK_PAGE({ bookId: ":bookId" }),
    loader: () => import("../pages/books/book.page"),
  },
  {
    path: routes.CHAPTER_PAGE({ chapterId: ":chapterId" }),
    loader: () => import("../pages/reader/chapter/chapter-reader.page"),
  },
];

export default routes_definition;
