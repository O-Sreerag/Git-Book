CREATE TABLE IF NOT EXISTS "friends" (
	"id" serial PRIMARY KEY NOT NULL,
	"user1" varchar(255) NOT NULL,
	"user2" varchar(255) NOT NULL,
	CONSTRAINT "friends_user1_user2_unique" UNIQUE("user1","user2")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"name" varchar(255),
	"location" varchar(255),
	"blog" varchar(255),
	"bio" text,
	"public_repos" integer,
	"public_gists" integer,
	"followers" integer,
	"following" integer,
	"created_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DROP TABLE "account";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friends_user1_user2_index" ON "friends" ("user1","user2");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_username_index" ON "users" ("username");