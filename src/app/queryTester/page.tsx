import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { blogs, blogsAndCategories, blogsAndImages, images, tags } from "~/server/schema";

export default async function QTester() {
  const catsData = await db.query.categories.findMany({
    with: {
      blogsAndCategories: {
        where: eq(blogsAndCategories.blogId, 'd_blog@')
      }
    }
  })

  return (
    <div>
      {JSON.stringify(catsData)}
    </div>
  );
}