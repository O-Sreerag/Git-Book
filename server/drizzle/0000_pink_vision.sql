CREATE TABLE IF NOT EXISTS "friends" (
	"id" serial PRIMARY KEY NOT NULL,
	"user1" varchar(255) NOT NULL,
	"user2" varchar(255) NOT NULL,
	CONSTRAINT "friends_user1_user2_unique" UNIQUE("user1","user2")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repos" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"description" text,
	"language" varchar(255),
	"stargazers_count" integer DEFAULT 0,
	"forks_count" integer DEFAULT 0,
	"open_issues_count" integer DEFAULT 0,
	"owner_id" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
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
DO $$ BEGIN
 ALTER TABLE "repos" ADD CONSTRAINT "repos_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friends_user1_user2_index" ON "friends" USING btree ("user1","user2");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "repos_name_index" ON "repos" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "repos_owner_id_index" ON "repos" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_username_index" ON "users" USING btree ("username");