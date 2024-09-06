import { eq, ilike, sql, isNull, asc, desc } from "drizzle-orm";
import { userTableInsertType, friendTableInsertType } from "../db/schema.js"
import db from "../db/db.js";
import { userTable, friendTable } from "../db/schema.js";
import { PgColumn } from "drizzle-orm/pg-core";

export const getUserByUsername = async (username: string) => {
    return db().select().from(userTable).where(eq(userTable.username, username)).limit(1);
};

export const createUser = async (userData: any) => {
    return db().insert(userTable).values(userData).returning();
};

export const updateUser = async (username: string, updatedData: any) => {
    return db().update(userTable)
        .set(updatedData)
        .where(eq(userTable.username, username))
        .returning();
};

export const deleteUser = async (username: string) => {
    return db().update(userTable)
        .set({ deletedAt: new Date() })
        .where(eq(userTable.username, username));
};

export const insertFriends = async ({ username, friend }: { username: string, friend: string }) => {
    return db().insert(friendTable).values({ user1: username, user2: friend }).returning();
};

export const searchUsers = async (filters: { username?: string, location?: string }) => {
    const query = db().select().from(userTable);

    if (filters.username) {
        query.where(ilike(userTable.username, `%${filters.username}%`));
    }

    if (filters.location) {
        query.where(ilike(userTable.location, `%${filters.location}%`));
    }

    return await query.execute();
};

export const sortUsers = async (
    sort_by?: keyof typeof userTable,
    order?: 'asc' | 'desc'
) => {
    if (!sort_by || !(sort_by in userTable)) {
        return { error: `Invalid sort field: ${String(sort_by)}` };
    }

    const sortColumn = userTable[sort_by] as PgColumn<any, any, any>;
    
    const query = db().select()
        .from(userTable)
        .where(isNull(userTable.deletedAt));

    if (order === 'asc') {
        query.orderBy(asc(sortColumn));
    } else {
        query.orderBy(desc(sortColumn));
    }

    return await query;
};