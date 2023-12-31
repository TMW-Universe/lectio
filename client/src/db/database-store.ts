import { DatabaseTransaction } from "./database-transaction";

export class DatabaseStore {
  private readonly store: IDBObjectStore;

  constructor(
    private readonly name: string,
    private readonly transaction: DatabaseTransaction
  ) {
    this.store = this.transaction.instantiateTransaction().objectStore(name);
  }

  public getName = () => this.name;
  public getStore = () => this.store;

  // DML

  public put = <T extends object>(value: T) => {
    const store = this.getStore();
    store.put(value);
  };

  public batchPut = <T extends object>(values: T[]) => {
    const store = this.getStore();
    return values.map((value) => store.put(value));
  };

  public getByIndex = async <T extends object>(
    indexName: string,
    value: string
  ) => {
    const index = this.getStore().index(indexName);
    const request = index.get(value);
    return await new Promise<T>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject();
    });
  };

  public getAll = async <T extends object>(
    query?: IDBValidKey | IDBKeyRange | null | undefined,
    count?: number | undefined
  ) => {
    const result = this.getStore().getAll(query, count);
    return await new Promise<T[]>((resolve, reject) => {
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject();
    });
  };

  public count = async (query?: IDBValidKey | IDBKeyRange | undefined) => {
    const result = this.getStore().count(query);
    return await new Promise<number>((resolve, reject) => {
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject();
    });
  };

  public delete = async (query: IDBValidKey | IDBKeyRange) => {
    const result = this.getStore().delete(query);
    return await new Promise<void>((resolve, reject) => {
      result.onsuccess = () => resolve();
      result.onerror = () => reject();
    });
  };

  public deleteByField = async <T extends object, K = keyof T>(
    indexName: K,
    values: unknown[]
  ) => {
    const store = this.getStore();
    const index = store.index(indexName as string);
    await Promise.all(
      values.map(async (value) => {
        const cursor = index.openCursor(IDBKeyRange.only(value));

        return await new Promise<void>((resolve, reject) => {
          cursor.onsuccess = () => {
            if (cursor.result?.primaryKey) {
              store.delete(cursor.result.primaryKey);
              resolve();
            } else reject();
          };
          cursor.onerror = () => reject();
        });
      })
    );
  };
}
