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
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation"
import usePromise from "~/hooks/usePromise";
import { addComment } from "~/server/api/routers/commentsRouter";
import { UserNotSignedInError } from "~/lib/errors/userNotSignedInError";
import { useToast } from "~/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai"

dayjs.extend(relativeTime);

export default function Comment (props: comment & {blogId: string}) {
  const [replies, setReplies] = useState(props.replies);
  const [replyFormOpen, setReplyFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [mutationLoading, setMutationLoading] = useState(false);

  const { isSignedIn, user } = useUser();

  const { toast } = useToast()

  const url = usePathname();

  type reply = {
    comment: string
  }
  const {register, handleSubmit, reset} = useForm<reply>();
  const onReplySubmit: SubmitHandler<reply> = async (values) => {
    if(!user) throw new UserNotSignedInError('User is not signed in and therefor cannot comment');

    // Generate the new comment
    const newComment = {
      commentText: values.comment,
      createdAt: new Date(),
      id: generateUID('comment'),
      ownerName: user?.fullName ?? 'Anonymous',
      replies: []
    }

    // Call API to add comment
    setMutationLoading(true);
    try {
      await addComment({
        comment: newComment,
        blogId: props.blogId,
        userId: user.id,
        repliesToId: props.id
      });
    } catch (e) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'There was an error adding your comment, please try again later'
      });
    }
    setMutationLoading(false);

    // Add reply to comment
    setReplies([...replies, newComment]);

    // Reset the form
    reset();
    setReplyFormOpen(false);
  }

  const onReplySubmitError: SubmitErrorHandler<reply> = (values) => {
    setErrorMessage(values.comment?.message);
  }

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

      {/* Reply form */}
      {replyFormOpen && (
        <div className="flex flex-col pb-2">
          <form className="w-fit flex flex-row gap-1 ml-2" onSubmit={handleSubmit(onReplySubmit, onReplySubmitError)}>
            <Input
              className="min-w-fit"
              {...register('comment', {
                required: 'Please enter a comment'
              })}
            />
            <Button
              variant='destructive' 
              type="button" onClick={() => setReplyFormOpen(false)}
              disabled={mutationLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutationLoading}
            >
              {mutationLoading
                ? <AiOutlineLoading3Quarters className="animate-spin" color="blue" />
                : "Add"
              }
            </Button>
          </form>
          {errorMessage && <p className="text-xs text-red-700 font-semibold pl-2 pt-1">{errorMessage}</p>}
        </div>
      )}

      {/* Comment Replies */}
      <div className="pl-3">
        {replies.map(comment => (
          <div key={comment.id} className="pt-2 pl-1 border-l-2 border-l-gray-400">
            <Comment {...comment} blogId={props.blogId} />
          </div>
        ))}
      </div>
    </>
  );
}