CREATE TABLE IF NOT EXISTS "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"comment" text NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" date DEFAULT now(),
	"blog_replies_to_blog_id" text NOT NULL,
	"comment_replies_to_id" text
);
--> statement-breakpoint
ALTER TABLE "blogs_and_images" DROP CONSTRAINT "blogs_and_images_blog_id_blog_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blogs_and_images" ADD CONSTRAINT "blogs_and_images_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_blog_replies_to_blog_id_blog_id_fk" FOREIGN KEY ("blog_replies_to_blog_id") REFERENCES "blog"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
