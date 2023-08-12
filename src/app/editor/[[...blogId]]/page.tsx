import { currentUser } from "@clerk/nextjs";
import { UserNotAllowedToPostError } from "~/lib/errors/userNotAllowedError";
import { UserNotSignedInError } from "~/lib/errors/userNotSignedInError";
import checkAllowedUsers from "~/lib/helpers/checkAllowedUsers";
import generateUID from "~/lib/helpers/generateUID";
import { db } from "~/server/db";
import { eq } from 'drizzle-orm';
import { blogs } from "~/server/schema";
import { UserNotOwnerError } from "~/lib/errors/userNotOwnerError";

export default async function EditorPage({ searchParams } : {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await currentUser();
  if(!user) throw new UserNotSignedInError('You are not signed in');

  const allowedToPost = checkAllowedUsers(user);
  if(!allowedToPost) throw new UserNotAllowedToPostError('You are not allowed to create blog posts');

  let blogId = searchParams['blogId']?.at(0);
  let blog;
  
  if(!blogId) {
    blogId = generateUID('draft');
  } else {
    blog = await db.query.blogs.findFirst({ where: eq(blogs.id, blogId) });
    if(blog?.ownerId !== user.id) throw new UserNotOwnerError('You are not the owner of this blog post');
  }

  const [
    categories,
  ] = await Promise.all([
    db.query.categories.findMany({ with: { blogsAndCategories: { where: eq(blogs.id, blogId )} } })
  ]);

  return (
    <>Hello world</>
  );
}