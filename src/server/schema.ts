import { boolean, date, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const blogs = pgTable('blog', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').default(''),
  createdAt: date('created_at').notNull(),
  lastUpdated: date('last_updated').defaultNow(),
  pinned: boolean('pinned'),
  pinnedAt: date('pinned_at')
});