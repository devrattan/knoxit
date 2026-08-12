import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run Drizzle migrations");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL
  },
  strict: true,
  verbose: true
});
