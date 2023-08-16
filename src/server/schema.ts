import { relations } from 'drizzle-orm';
import { boolean, date, pgTable, primaryKey, serial, text, varchar } from 'drizzle-orm/pg-core'


/* ----------------------------------------------------- Users ------------------------------------------------------ */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  bio: varchar('bio', { length: 256 }),
  name: text('name'),
  profilePictureUrl: text('profile_picture_url')
});

/* ----------------------------------------------------- blogs ------------------------------------------------------ */

export const blogs = pgTable('blog', {
  id: varchar('id', { length: 8 }).primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').default(''),
  createdAt: date('created_at').notNull(),
  lastUpdated: date('last_updated').defaultNow(),
  pinned: boolean('pinned'),
  pinnedAt: date('pinned_at')
});

export const blogRelations = relations(blogs, ({ one, many }) => ({
  blogsAndCategories: many(blogsAndCategories),
  tags: many(tags)
}))

/* --------------------------------------------------- Categories --------------------------------------------------- */

export const categories = pgTable('categories', { 
  id: text('id').primaryKey(),
  categoryName: text('category_name').notNull(),
  createdBy: text('created_by').notNull()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  blogsAndCategories: many(blogsAndCategories),
}))

export const blogsAndCategories = pgTable('blogs_and_categories', {
    blogId: text('blog_id').notNull().references(() => blogs.id),
    categoryId: text('category_id').notNull().references(() => categories.id)
  }, (t) => ({
    pk: primaryKey(t.blogId, t.categoryId)
  })
);

export const blogsAndCategoriesRelations = relations(blogsAndCategories, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogsAndCategories.blogId],
    references: [blogs.id]
  }),
  categories: one(categories, {
    fields: [blogsAndCategories.categoryId],
    references: [categories.id]
  })
}));

/* ------------------------------------------------------ Tags ------------------------------------------------------ */

export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  tag: text('tag').notNull(),
  blogId: text('blog_id').references(() => blogs.id)
});

export const tagsRelation = relations(tags, ({ one }) => ({
  blog: one(blogs, {
    fields: [tags.blogId],
    references: [blogs.id]
  })
}));

/* ----------------------------------------------------- Images ----------------------------------------------------- */
/*
export const images = pgTable('images', {

})
*/