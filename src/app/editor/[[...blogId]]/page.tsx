// Auth imports
import { currentUser } from "@clerk/nextjs";

// Custom Errors
import { UserNotAllowedToPostError } from "~/lib/errors/userNotAllowedError";
import { UserNotSignedInError } from "~/lib/errors/userNotSignedInError";
import { UserNotOwnerError } from "~/lib/errors/userNotOwnerError";

// Helper functions
import checkAllowedUsers from "~/lib/helpers/checkAllowedUsers";
import generateUID from "~/lib/helpers/generateUID";

// DB imports
import { db } from "~/server/db";
import { eq } from 'drizzle-orm';
import { blogs, tags } from "~/server/schema";

// Client component imports
import Editor from "./(editorComponents)/editor";
import DetailsAccordion from "./(editorComponents)/detailsAccordion";

export default async function EditorPage({ searchParams } : {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get the current user
  const user = await currentUser();
  if(!user) throw new UserNotSignedInError('You are not signed in');

  // Check to see if the user is allowed to post
  const allowedToPost = checkAllowedUsers(user);
  if(!allowedToPost) throw new UserNotAllowedToPostError('You are not allowed to create blog posts');

  // Get the blog post id from the search params
  let blogId = searchParams['blogId']?.at(0) ?? generateUID('draft');
  
  // Load the blog data from the DB 
  const blogPost = await db.query.blogs.findFirst({
    where: eq(blogs.id, blogId),
    with: {
      tags: {
        where: eq(blogs.id, tags.id)
      }
    }
  });

  //if(blogPost && blogPost.ownerId !== user.id) throw new UserNotOwnerError('You are not the owner of this blog');

  const [
    blogCategories
  ] = await Promise.all([
    // Query for categories
    db.query.categories.findMany({
      with: {
        blogsAndCategories: {
          columns: { blogId: true }
        }
      }
    }),

    // TODO write query for images
  ]);

  // Map categories to the category type
  const mappedCategories = blogCategories.map(cat => ({
    name: cat.categoryName,
    checked: cat.blogsAndCategories.at(0)?.blogId === blogId
  }));

  // Get final values from the db call
  const content = blogPost?.content ?? '';
  const title = blogPost?.title ?? '';
  const description = blogPost?.description ?? '';
  const blogTags = blogPost?.tags.map(t => t.tag);

  return (
    <div className="grid grid-cols-3">
      <div className="w-full h-screen p-3 col-span-2">
        <Editor preloadedBlog={{ content, title, description }}/>
      </div>
      <div className="h-screen pr-2">
        <DetailsAccordion categories={mappedCategories} tags={blogTags}/>
      </div>
    </div>
  );
}