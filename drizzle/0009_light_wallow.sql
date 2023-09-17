ALTER TABLE "blog" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "blog" ALTER COLUMN "last_updated" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "blog" ALTER COLUMN "pinned_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "create_at" SET DATA TYPE timestamp;