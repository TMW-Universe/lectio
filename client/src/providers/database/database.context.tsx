import { createContext } from "react";
import { DatabaseClient } from "../../db/database.client";
import { Database } from "../../db/database.enum";

export const DATABASE_CONTEXT = createContext<
  Partial<Record<Database, DatabaseClient>>
>({});
