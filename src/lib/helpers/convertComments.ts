import { comment } from "~/types";

export default function convertComments(comments: {
  id: string,
  ownerId: string,
  createdAt: Date,
  comment: string,
  blogRepliesToId: string,
  commentRepliesToId: string | null,
  users: {
      name: string | null
  }}[]
): comment[] {

  const convertedComments: comment[] = [];

  comments.forEach((comment) => {
    if(comment.commentRepliesToId === null) {
      convertedComments.push(convertToCommentType(comment));
    } else {
      const foundComment = findCommentWithDFS(comment.commentRepliesToId, convertedComments);
      if(foundComment) {
        foundComment.replies.push(convertToCommentType(comment))
      } else {
        convertedComments.push(convertToCommentType(comment))
      }
    }
  });
  return convertedComments;
}

function convertToCommentType(comment: {
  id: string,
  ownerId: string,
  createdAt: Date,
  comment: string,
  blogRepliesToId: string,
  commentRepliesToId: string | null,
  users: {
      name: string | null
  }
}): comment {
  return {
    comment: comment.comment,
    createdAt: comment.createdAt,
    id: comment.id,
    ownerName: comment.users.name ?? 'Anonymous',
    replies: []
  }
}

function findCommentWithDFS(id: string, commentList: comment[]) {
  const search = (comment: comment): (comment | null) => {
    if(comment.id === id) {
      return comment
    } else {
      for(let i = 0; i < comment.replies.length; i++) {
        const found = search(comment.replies[i]);
        if(found) return found;
      }
    }
    return null;
  }

  for(let i = 0; i < commentList.length; i++) {
    const foundComment = search(commentList[i]);
    if(foundComment !== null) {
      return foundComment;
    }
  }
  return null;
}