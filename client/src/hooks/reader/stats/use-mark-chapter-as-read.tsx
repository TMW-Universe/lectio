import { uuid } from "@tmw-universe/tmw-universe-types";
import { useNetworkStatus } from "../../network/use-network-status";
import { useDatabase } from "../../database/use-database";
import { Database } from "../../../db/database.enum";
import { useSendReadChapterStat } from "../../api/books/chapters/use-send-read-chapter-stat";
import { EndedChapterDBModel } from "../../../db/models/offline-chapters-info/ended-chapter.db-model";

export function useMarkChapterAsRead() {
  const { isOnline } = useNetworkStatus();
  const { mutateAsync: mutateReadChapter } = useSendReadChapterStat();

  const { client } = useDatabase(Database.OFFLINE_CHAPTERS_INFO);

  const storeToSync = async (chapter: EndedChapterDBModel) => {
    await client.transaction("ended_chapters", async ({ store }) => {
      store.put(chapter);
    });
  };

  const markChapterAsRead = async (chapterId: uuid) => {
    const chapter: EndedChapterDBModel = {
      chapterId,
      finishedReadingAt: new Date(Date.now()),
    };

    if (isOnline) {
      try {
        // Try sync
        await mutateReadChapter(chapter.chapterId);
      } catch (e) {
        // Store in local if fail
        await storeToSync(chapter);
      }
    } else {
      // If offline, store in local
      await storeToSync(chapter);
    }
  };

  return { markChapterAsRead };
}
