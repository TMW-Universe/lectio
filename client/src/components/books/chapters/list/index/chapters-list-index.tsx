import { Button, Col, Row } from "antd";
import { BookChapter } from "../../../../../models/books/book-chapter.model";

type Props = {
  chapters: BookChapter[];
};

export default function ChaptersListIndex({ chapters }: Props) {
  return (
    <Row gutter={[12, 12]}>
      {[...new Array(Math.floor(chapters.length / 10))].map((_, i) => {
        const chapter = (i + 1) * 10;
        return (
          <Col key={i}>
            <Button
              onClick={() => {
                document
                  .getElementById(
                    `_chapter_list_item_${
                      chapters.find((c) => c.number === chapter)?.number
                    }`
                  )
                  ?.scrollIntoView();
              }}
            >
              {chapter}
            </Button>
          </Col>
        );
      })}
    </Row>
  );
}
