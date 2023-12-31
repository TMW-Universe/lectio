import { Card } from "antd";
import { Book } from "../../../../models/books/book.model";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../router/routes";
import LanguageFlag from "../../../common/country-flag/language-flag";
import { Language } from "@tmw-universe/tmw-universe-types";
import styles from "./library-book-item.module.pcss";
import { gray, green } from "@ant-design/colors";

type Props = {
  book: Book;
};

export default function LibraryBookItem({ book }: Props) {
  const navigate = useNavigate();

  const navigateToBook = () => {
    navigate(routes.BOOK_PAGE({ bookId: book.id }));
  };

  return (
    <Card
      onClick={navigateToBook}
      role="button"
      title={book.name}
      hoverable
      cover={
        <>
          <img
            className={styles.cover}
            alt={`Cover of ${book.name}`}
            src={book.coverImageUrl}
            aria-description="Cover image"
            loading="lazy"
          />
          <div className={styles.progress} style={{ backgroundColor: gray[1] }}>
            <div style={{ backgroundColor: green[5], width: "50%" }}></div>
          </div>
        </>
      }
    >
      <div className={styles.content}>
        <LanguageFlag
          className={styles.flag}
          language={book.language as Language}
        />
      </div>
    </Card>
  );
}
