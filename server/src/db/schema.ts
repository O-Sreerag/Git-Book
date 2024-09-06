import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

// export const currencyEnum = pgEnum("currency", ["USD", "EUR", "GBP"]);

// export const accountTable = pgTable("account", {
//   id: serial("id").primaryKey(),
//   email: varchar("email", { length: 255 }).notNull(),
//   firstName: varchar("first_name", { length: 255 }).notNull(),
//   lastName: varchar("last_name", { length: 255 }).notNull(),
//   currency: currencyEnum("currency").notNull().default("USD"),
//   balance: integer("balance").notNull().default(0),
// });


export const userTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  location: varchar('location', { length: 255 }),
  blog: varchar('blog', { length: 255 }),
  bio: text('bio'),
  publicRepos: integer('public_repos'),
  publicGists: integer('public_gists'),
  followers: integer('followers'),
  following: integer('following'),
  createdAt: timestamp('created_at'),
  deletedAt: timestamp('deleted_at')
});

export const friendTable = pgTable('friends', {
  id: serial('id').primaryKey(),
  user1: varchar('user1', { length: 255 }).notNull(),
  user2: varchar('user2', { length: 255 }).notNull()
});

export type userTableInsertType = InferInsertModel<typeof userTable>
export type friendTableInsertType = InferInsertModel<typeof friendTable>

export type userTableSelectType = InferSelectModel<typeof userTable>
export type friendTableSelectType = InferSelectModel<typeof friendTable>