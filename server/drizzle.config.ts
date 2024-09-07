import { defineConfig } from "drizzle-kit";
import config from "./src/config/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: config().DB_URL,
  },
  dialect: "postgresql",
})
