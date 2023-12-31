import { DatabaseStore } from "./database-store";
import { DatabaseClient } from "./database.client";

export type DatabaseTransactionOptions = {
  readonly?: boolean;
};

export class DatabaseTransaction {
  constructor(
    private readonly client: DatabaseClient,
    private readonly storeName: string,
    private readonly options?: DatabaseTransactionOptions
  ) {}

  public instantiateTransaction = () => {
    return this.client.db.transaction(
      this.storeName,
      this.options?.readonly ? "readonly" : "readwrite"
    );
  };

  public getStore = (storeName: string) => new DatabaseStore(storeName, this);
}
