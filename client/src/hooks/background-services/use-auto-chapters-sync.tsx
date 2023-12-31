import { useEffect } from "react";
import { useNetworkStatus } from "../network/use-network-status";
import { useDatabase } from "../database/use-database";
import { Database } from "../../db/database.enum";
import { useSyncReadChapters } from "../api/books/chapters/use-sync-read-chapters";
import { EndedChapterDBModel } from "../../db/models/offline-chapters-info/ended-chapter.db-model";
import { useTwmuAccount } from "@tmw-universe/react-tmw-universe-authentication-utils";

const READ_STEP_SIZE = 10;

export function useAutoChaptersSync() {
  const { isOnline } = useNetworkStatus();
  const { mutateAsync } = useSyncReadChapters();
  const { isAuthenticated } = useTwmuAccount();

  const { client: offlineChaptersInfoClient } = useDatabase(
    Database.OFFLINE_CHAPTERS_INFO
  );

  useEffect(() => {
    const func = async () => {
      const transaction =
        offlineChaptersInfoClient.createTransaction("ended_chapters");

      const count = await transaction.getStore("ended_chapters").count();
      for (let i = 0; i < Math.ceil(count / READ_STEP_SIZE); i++) {
        const data = await transaction
          .getStore("ended_chapters")
          .getAll<EndedChapterDBModel>(null, READ_STEP_SIZE);
        try {
          await mutateAsync(data);
          const ids = data.map((d) => d.chapterId);
          await transaction
            .getStore("ended_chapters")
            .deleteByField<EndedChapterDBModel>("chapterId", ids);
        } catch (e) {
          console.error("An error occurred while syncing read chapters");
        }
      }
    };

    if (isOnline && isAuthenticated) {
      func();
    }
  }, [isAuthenticated, isOnline, mutateAsync, offlineChaptersInfoClient]);
}
