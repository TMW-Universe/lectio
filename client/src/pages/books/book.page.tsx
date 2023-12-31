import { useParams } from "react-router-dom";
import BookLanding from "../../components/books/book-landing/book-landing";

export default function BookPage() {
  const { bookId } = useParams();

  if (!bookId) throw new Error();

  return <BookLanding bookId={bookId} />;
}
