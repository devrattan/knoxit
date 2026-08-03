import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export * from "./schema";

const databaseUrl = process.env.DATABASE_URL;

function createDb() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before the Knoxit API can access the database");
  }

  const client = postgres(databaseUrl, { prepare: false });
  return drizzle(client, { schema });
}

let dbInstance: ReturnType<typeof createDb> | null = null;

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    dbInstance ??= createDb();
    return dbInstance[prop as keyof typeof dbInstance];
  }
});
