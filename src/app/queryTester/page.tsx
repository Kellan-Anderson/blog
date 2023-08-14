import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { blogs, blogsAndCategories, tags } from "~/server/schema";

export default async function QTester() {
  const blogId = 'd_blog1';

  const blog = await db.query.blogs.findFirst({
    with: {
      tags: {
        where: eq(blogs.id, tags.id)
      }
    },
    where: eq(blogs.id, blogId)
  });

  const allCategories = await db.query.categories.findMany({
    with:  {
      blogsAndCategories: {
        columns: {
          blogId: true
        }
      }
    }
  });

  const cats = allCategories.map(cat => ({
    name: cat.categoryName,
    checked: cat.blogsAndCategories.at(0)?.blogId === blogId
  }));

  const blogContent = JSON.stringify(blog?.content);
  const blogTitle = JSON.stringify(blog?.tags);
  const blogDescription = JSON.stringify(blog?.description);
  const blogTags = JSON.stringify(blog?.tags);
  const blogCategories = JSON.stringify(cats);


  return (
    <div className="markdown">
      <h1>This is in the top div</h1>
      <div>
        <h1>This is in the second div</h1>
        <div>
          <h1>This is in the third div</h1>
          <div>
            <h1>This is in the forth div</h1>
          </div>
        </div>
      </div>
    </div>
  );
}