import { useEffect, useState } from "react";
import { DATABASE_CONTEXT } from "./database.context";
import { DatabaseClient } from "../../db/database.client";
import { Database } from "../../db/database.enum";
import { DATABASES } from "../../db/databases.const";

type Props = {
  children: JSX.Element;
};

export default function DatabaseProvider({ children }: Props) {
  const [clients, setClients] =
    useState<Partial<Record<Database, DatabaseClient>>>();

  useEffect(() => {
    generateClients();
  }, []);

  const generateClients = async () => {
    const c: Partial<Record<Database, DatabaseClient>> = {};
    for (const database of DATABASES) {
      c[database.name] = await DatabaseClient.new(database.name, {
        onUpgradeNeeded: database.upgrade,
      });
    }
    setClients(c);
  };

  if (clients === undefined) return null;

  return (
    <DATABASE_CONTEXT.Provider value={clients}>
      {children}
    </DATABASE_CONTEXT.Provider>
  );
}
