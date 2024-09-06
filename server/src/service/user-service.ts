import { eq, sql } from "drizzle-orm";
import { userTableInsertType, friendTableInsertType } from "../db/schema.js"
import db from "../db/db.js";
import { userTable } from "../db/schema.js";

export const create = async (input: userTableInsertType): Promise<void> => {
  const results = await db().insert(userTable).values(input).returning();
};

export const findUserByName = async (input: any): Promise<any> => {
    const results = await  db().select().from(userTable).where(eq(userTable.username, input));
    return results
}