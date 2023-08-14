CREATE TABLE IF NOT EXISTS "blogs_and_categories" (
	"blog_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT blogs_and_categories_blog_id_category_id PRIMARY KEY("blog_id","category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"category_name" text NOT NULL,
	"created_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog" ALTER COLUMN "id" SET DATA TYPE varchar(8);--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blogs_and_categories" ADD CONSTRAINT "blogs_and_categories_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blogs_and_categories" ADD CONSTRAINT "blogs_and_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
