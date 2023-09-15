import { eq } from "drizzle-orm";
import convertComments from "~/lib/helpers/convertComments";
import { db } from "~/server/db";
import { comments } from "~/server/schema";
import Comment from "./comments";
import CommentButton from "./commentButton";
import CommentForm from "./commentForm";
import CommentsArea from "./comments";

export default async function BlogComments({ params }: { params: { blogId: string } }) {
  const blogComments = await db.query.comments.findMany({
    where: eq(comments.blogRepliesToId, params.blogId),
    with: {
      users: {
        columns: {
          name: true
        }
      } 
    }
  });

  const convertedComments = convertComments(blogComments);

  return (
    <div className="flex flex-col z-20 px-9 py-4 text-black dark:text-white border border-black rounded-b-3xl bg-slate-100 dark:bg-zinc-800">
      <CommentsArea comments={convertedComments} />
    </div>
  );
}