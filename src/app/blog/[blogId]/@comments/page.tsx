import { eq } from "drizzle-orm";
import convertComments from "~/lib/helpers/convertComments";
import { db } from "~/server/db";
import { comments } from "~/server/schema";
import { comment } from "~/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

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
    <div className="flex flex-col gap-5">
      {convertedComments.map(comment => <Comment {...comment} key={comment.id} />)}
    </div>
  );
}

function Comment(props: comment) {
  return (
    <div className="">
      <div className="font-semibold text-xs flex flex-row items-center gap-1">
        <p>{props.ownerName}</p>
        <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
        <p>{dayjs(props.createdAt).fromNow()}</p>
      </div>
      <div className="ml-2 text-sm pb-1">
        {props.comment}
      </div>
      <div className="pl-3">
        {props.replies.map(comment => (
          <div key={comment.id} className="pt-2 pl-1 border-l-2">
            <Comment {...comment} />
          </div>
        ))}
      </div>
    </div>
  );
}