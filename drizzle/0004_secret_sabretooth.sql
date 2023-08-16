CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"bio" varchar(256),
	"name" text,
	"profile_picture_url" text
);
