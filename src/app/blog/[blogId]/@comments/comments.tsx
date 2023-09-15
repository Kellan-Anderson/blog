'use client'

import { useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Dot } from "~/components/ui/dot";
import { Input } from "~/components/ui/input";
import { comment } from "~/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import generateUID from "~/lib/helpers/generateUID";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useParams, usePathname } from "next/navigation"
import { addComment } from "~/server/api/routers/commentsRouter";
import { UserNotSignedInError } from "~/lib/errors/userNotSignedInError";
import { useToast } from "~/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { Textarea } from "~/components/ui/textarea";

dayjs.extend(relativeTime);

export default function CommentsArea({ comments: blogComments }: { comments: comment[] }) {
  const [comments, setComments] = useState<comment[]>(blogComments);
  const [commentFormOpen, setCommentFormOpen] = useState(false);

  return (
    <>
      <div className="py-2.5">
        {comments.map((comment) => <Comment {...comment} key={comment.id}/>)}
      </div>

      {commentFormOpen ? (
        <div className="">
          <CommentForm 
            commentFormOpen={commentFormOpen} 
            onCommentFormOpenChange={setCommentFormOpen}
            onReply={(comment) => setComments([...comments, comment])}
          />
        </div>
      ) : (
          <CommentSignInButton onCommentClick={() => setCommentFormOpen(true)} />
      )}
    </>
  );
}

function Comment(props: comment) {
  const [replyFormOpen, setReplyFormOpen] = useState(false);
  const [replies, setReplies] = useState(props.replies);

  const { isSignedIn } = useUser();
  const url = usePathname();

  return (
    <>
      {/* Comment details */}
      <div className="font-semibold text-xs flex flex-row items-center gap-1">
        <p>{props.ownerName}</p>
        <Dot />
        <p>{dayjs(props.createdAt).fromNow()}</p>
        <Dot />
        {isSignedIn
          ? (
            <h2
              className="hover:underline cursor-pointer"
              onClick={() => setReplyFormOpen(true)}
            >
              Reply
            </h2>
          ) : (
            <SignInButton mode="modal" redirectUrl={url}>
              <h2 className="hover:underline cursor-pointer">Sign in to reply</h2>
            </SignInButton>
          )
        }
      </div>

      {/* Comment text */}
      <div className="ml-2 pb-1">
        {props.commentText}
      </div>

      {replyFormOpen &&
        <CommentForm 
          replyId={props.id} 
          onReply={(newComment) => {setReplies([...replies, newComment])}}
          onCommentFormOpenChange={setReplyFormOpen}
          commentFormOpen={replyFormOpen}
        />
      }

      {/* Comment Replies */}
      <div className="pl-3">
        {replies.map(comment => (
          <div key={comment.id} className="pt-2 pl-1 border-l-2 border-l-gray-400">
            <Comment {...comment} />
          </div>
        ))}
      </div>
    </>
  );
}

function CommentForm({
  replyId,
  onReply,
  commentFormOpen,
  onCommentFormOpenChange
} : {
  replyId?: string,
  onReply?: (arg0: comment) => void,
  commentFormOpen?: boolean,
  onCommentFormOpenChange?: (arg0: boolean) => void
}) {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const params = useParams();

  const { user, isLoaded } = useUser();

  const { toast } = useToast();

  type commentFormType = {
    commentText: string
  }
  const {register, handleSubmit, reset} = useForm<commentFormType>();
  const onReplySubmit: SubmitHandler<commentFormType> = async (values) => {
    if(isLoaded) {
      if(!user) throw new UserNotSignedInError('User is not signed in and cannot comment');

      const blogId = params['blogId'];
      if(blogId === '' || Array.isArray(blogId)) throw new Error('No blog id provided');

      const newComment: comment = {
        commentText: values.commentText,
        createdAt: new Date(),
        id: generateUID('comment'),
        ownerName: user.fullName ?? 'Anonymous',
        replies: []
      }

      try {
        setLoading(true);
        await addComment({
          comment: newComment,
          userId: user.id,
          repliesToId: replyId,
          blogId: blogId.split('/')[0],
        });
        reset();
        onCommentFormOpenChange?.(false);
        onReply?.(newComment);
      } catch(err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error leaving your comment, please try again later'
        });
      }
      setLoading(false);
    }
  }

  const onReplySubmitError: SubmitErrorHandler<commentFormType> = (values) => {
    setErrorMessage(values.commentText?.message);
  }

  if(!commentFormOpen) return <></>

  return (
    <>
      <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit(onReplySubmit, onReplySubmitError)}>
        <Textarea
          {...register('commentText', {
            required: 'Please enter a comment'
          })}
          className="w-full"
        />
        <div className="w-full flex flex-row justify-end gap-2">
          <Button
            variant="destructive"
            onClick={() => onCommentFormOpenChange?.(false)}
            type="button"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin" color="white" /> : "Comment"}
          </Button>
        </div>
      </form>
      {errorMessage && <p className="text-xs text-red-700 font-semibold pl-2 pt-1">{errorMessage}</p>}
    </>
  );
}

function CommentSignInButton({ onCommentClick } : { onCommentClick?: () => void }) {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();

  if(!isLoaded) return (
    <Button disabled>
      <AiOutlineLoading3Quarters className="animate-spin" color="white" />
    </Button>
  );

  if(isLoaded && !isSignedIn) return (
    <SignInButton mode='modal' redirectUrl={pathname}>
      <Button>
        Sign in to comment
      </Button>
    </SignInButton>
  );

  return (
    <Button onClick={() => onCommentClick?.()}>
      Leave a comment
    </Button>
  );
}