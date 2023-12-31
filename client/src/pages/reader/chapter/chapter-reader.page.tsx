import { useParams } from "react-router-dom";
import ChapterReader from "../../../components/reader/chapter/chapter-reader";
import ReaderSettingsProvider from "../../../providers/reader/reader-settings.provider";

export default function ChapterReaderPage() {
  const { chapterId } = useParams();

  if (!chapterId) throw new Error();

  return (
    <ReaderSettingsProvider>
      <ChapterReader chapterId={chapterId} />
    </ReaderSettingsProvider>
  );
}
