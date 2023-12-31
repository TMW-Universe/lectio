import { DatabaseStore } from "./database-store";
import {
  DatabaseTransaction,
  DatabaseTransactionOptions,
} from "./database-transaction";
import { Database } from "./database.enum";

type Options = {
  onUpgradeNeeded: (request: IDBOpenDBRequest, dv: IDBDatabase) => void;
};

export class DatabaseClient {
  private constructor(
    public readonly name: Database,
    public readonly request: IDBOpenDBRequest,
    public readonly db: IDBDatabase
  ) {}

  public static async new(name: Database, options?: Options) {
    let db: IDBDatabase;
    let request: IDBOpenDBRequest;
    await new Promise((resolve, reject) => {
      request = indexedDB.open(name, 1);

      // Events
      if (options) {
        if (options.onUpgradeNeeded) {
          request.onupgradeneeded = (event) => {
            const db = (event?.target as unknown as { result: IDBDatabase })
              ?.result;
            options.onUpgradeNeeded(request, db);
          };
        }
      }

      request.onerror = () => {
        reject("Database error");
      };

      request.onsuccess = (event: Event) => {
        db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        resolve(null);
      };
    });
    if (!request! || !db!) throw new Error();

    return new DatabaseClient(name, request, db);
  }

  // Management

  public createTransaction(
    storeName: string,
    options?: DatabaseTransactionOptions
  ) {
    return new DatabaseTransaction(this, storeName, options);
  }

  public async transaction<T>(
    storeName: string,
    fn: (options: {
      store: DatabaseStore;
      transaction: DatabaseTransaction;
    }) => Promise<T>,
    options?: DatabaseTransactionOptions
  ): Promise<T> {
    const transaction = this.createTransaction(storeName, options);
    const store = transaction.getStore(storeName);
    const result = await fn({ transaction, store });
    return result;
  }
}
