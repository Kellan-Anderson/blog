import { comment } from "~/types";

export function addComment({
  comment,
  userId,
  blogId,
  repliesToId
} : {
  comment: comment,
  userId: string,
  blogId: string,
  repliesToId?: string
}) {
  const body = JSON.stringify({
    id: comment.id,
    comment: comment.commentText,
    ownerId: userId,
    createdAt: comment.createdAt,
    blogRepliesToId: blogId,
    commentRepliesToId: repliesToId
  });

  return fetch('/api/comments', {
    body,
    method: 'POST',
    headers: {'Content-Type': "application/json"}
  });
}