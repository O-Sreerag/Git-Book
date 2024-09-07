import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar, text, integer, timestamp, unique, index, foreignKey } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  avatar_url: varchar('avatar_url', { length: 255 }),
  location: varchar('location', { length: 255 }),
  blog: varchar('blog', { length: 255 }),
  bio: text('bio'),
  publicRepos: integer('public_repos'),
  publicGists: integer('public_gists'),
  followers: integer('followers'),
  following: integer('following'),
  createdAt: timestamp('created_at'),
  deletedAt: timestamp('deleted_at')
}, (userTable) => ({
  usernameIndex: index().on(userTable.username)
}));

export const repoTable = pgTable('repos', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  description: text('description'),
  language: varchar('language', { length: 255 }),
  stargazersCount: integer('stargazers_count').default(0),
  forksCount: integer('forks_count').default(0),
  openIssuesCount: integer('open_issues_count').default(0),
  ownerId: integer('owner_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
}, (repoTable) => ({
  repoNameIndex: index().on(repoTable.name),
  ownerIndex: index().on(repoTable.ownerId),
  ownerFk: foreignKey({
    columns: [repoTable.ownerId],
    foreignColumns: [userTable.id]
  })
}));

export const friendTable = pgTable('friends', {
  id: serial('id').primaryKey(),
  user1: varchar('user1', { length: 255 }).notNull(),
  user2: varchar('user2', { length: 255 }).notNull()
}, (friendTable) => ({
  uniqueFriendship: unique().on(friendTable.user1, friendTable.user2),
  friendshipIndex: index().on(friendTable.user1, friendTable.user2)
}));

export type userTableInsertType = InferInsertModel<typeof userTable>;
export type repoTableInsertType = InferInsertModel<typeof repoTable>;
export type friendTableInsertType = InferInsertModel<typeof friendTable>;

export type userTableSelectType = InferSelectModel<typeof userTable>;
export type friendTableSelectType = InferSelectModel<typeof friendTable>;
