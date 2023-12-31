import { useContext } from "react";
import { DATABASE_CONTEXT } from "../../providers/database/database.context";
import { Database } from "../../db/database.enum";

export function useDatabase(name: Database) {
  const context = useContext(DATABASE_CONTEXT);

  if (!context) throw new Error("No local database");

  const client = context[name];

  if (!client) throw new Error("No client is initialized for " + name);

  return {
    client,
  };
}
