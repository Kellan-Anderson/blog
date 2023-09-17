import { relations } from 'drizzle-orm';
import { boolean, pgTable, primaryKey, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod';


/* ----------------------------------------------------- Users ------------------------------------------------------ */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  bio: varchar('bio', { length: 256 }),
  name: text('name'),
  profilePictureUrl: text('profile_picture_url')
});

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  comments: many(comments),
}))

/* ----------------------------------------------------- blogs ------------------------------------------------------ */

export const blogs = pgTable('blog', {
  id: varchar('id', { length: 8 }).primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').default(''),
  createdAt: timestamp('created_at').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow(),
  pinned: boolean('pinned'),
  pinnedAt: timestamp('pinned_at')
});

export const blogRelations = relations(blogs, ({ one, many }) => ({
  owner: one(users, {
    fields: [blogs.ownerId],
    references: [users.id]
  }),
  blogsAndCategories: many(blogsAndCategories),
  tags: many(tags),
  imagesAndBlogs: many(blogsAndImages),
  comments: many(comments)
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

export const images = pgTable('images', {
  id: text('id').primaryKey(),
  imageName: varchar('image_name', { length: 48 }),
  imageUrl: text('image_url').notNull(),
  ownedBy: text('owned_by').references(() => users.id),
  createdAt: timestamp('create_at').defaultNow()
});

export const imagesRelations = relations(images, ({ one, many }) => ({
  owner: one(users),
  blogs: many(blogsAndImages)
}));

export const blogsAndImages = pgTable('blogs_and_images', {
    blogId: text('blog_id').notNull().references(() => blogs.id, { onDelete: 'cascade' }),
    imageId: text('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  }, (t) => ({
    pk: primaryKey(t.blogId, t.imageId)
  })
);

export const blogsAndImagesRelations = relations(blogsAndImages, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogsAndImages.blogId],
    references: [blogs.id]
  }),
  images: one(images, {
    fields: [blogsAndImages.imageId],
    references: [images.id]
  })
}));

/* ---------------------------------------------------- Comments ---------------------------------------------------- */

export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  comment: text('comment').notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  blogRepliesToId: text('blog_replies_to_blog_id').notNull().references(() => blogs.id),
  commentRepliesToId: text('comment_replies_to_id')
});

export const commentRelation = relations(comments, ({ one }) => ({
  blogs: one(blogs, {
    fields: [comments.blogRepliesToId],
    references: [blogs.id]
  }),
  users: one(users, {
    fields: [comments.ownerId],
    references: [users.id]
  })
}));

export const insertCommentSchema = createInsertSchema(comments);
