CREATE TABLE IF NOT EXISTS "blog" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text DEFAULT '',
	"created_at" date NOT NULL,
	"last_updated" date DEFAULT now(),
	"pinned" boolean,
	"pinned_at" date
);
