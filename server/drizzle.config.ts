import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config()

console.log(process.env.DB_URL)

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  dialect: "postgresql",
})
