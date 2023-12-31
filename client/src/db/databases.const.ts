import { Database } from "./database.enum";

export const DATABASES: {
  name: Database;
  upgrade: (request: IDBOpenDBRequest, dv: IDBDatabase) => void;
}[] = [
  {
    name: Database.BOOKS,
    upgrade: (_, db) => {
      // Books store
      const booksStore = db.createObjectStore("books", { keyPath: "id" });
      booksStore.createIndex("id", "id");
      booksStore.createIndex("language", "language");
    },
  },
  {
    name: Database.OFFLINE_CHAPTERS_INFO,
    upgrade: (_, db) => {
      // Store ended chapters to sync
      const endedChaptersStore = db.createObjectStore("ended_chapters", {
        keyPath: "chapterId",
      });
      endedChaptersStore.createIndex("chapterId", "chapterId");
    },
  },
];
