import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "./schema.js"
import { config } from 'dotenv'
config()

if (!process.env.DB_URL) {
    throw new Error("DB credentials error");
}
const client = postgres(process.env.DB_URL!, { max: 1 })
export const db = drizzle(client, { schema })