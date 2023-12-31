import { uuid } from "@tmw-universe/tmw-universe-types";

export interface EndedChapterDBModel {
  chapterId: uuid;
  finishedReadingAt: Date;
}
