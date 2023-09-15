import convertComments from "~/lib/helpers/convertComments";
import Comment from "./testComment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { RedirectToSignIn, SignOutButton } from "@clerk/nextjs";
dayjs.extend(relativeTime);

export default function TestPage() {
  /*
    {
    id: string;
    ownerId: string;
    createdAt: string;
    comment: string;
    blogRepliesToId: string;
    commentRepliesToId: string | null;
    users: {
        name: string | null;
    };
  }[]
  */
  type testCommentsType = {
      id: string,
      ownerId: string,
      createdAt: Date,
      comment: string,
      blogRepliesToId: string,
      commentRepliesToId: string | null,
      users: {
          name: string | null,
      };
  }

  const testComments: testCommentsType[] = [
    {
      blogRepliesToId: 'blog1',
      comment: 'cm6 - replies from cm7 & cm8', 
      commentRepliesToId: null, 
      createdAt: new Date(), 
      id: 'cm6', 
      ownerId: 'me', 
      users: {name: 'moose'}
    },
    {
      blogRepliesToId: 'blog1',
      comment: 'cm7 - replies to cm6, replies from cm9', 
      commentRepliesToId: 'cm6', 
      createdAt: new Date(), 
      id: 'cm7', 
      ownerId: 'me', 
      users: {name: 'moose'}
    },
    {
      blogRepliesToId: 'blog1',
      comment: 'cm8 - replies to cm6, replies from cm0', 
      commentRepliesToId: 'cm7', 
      createdAt: new Date(), 
      id: 'cm8', 
      ownerId: 'me', 
      users: {name: 'moose'}
    },
    {
      blogRepliesToId: 'blog1',
      comment: 'cm9 - replies to cm7', 
      commentRepliesToId: 'cm8', 
      createdAt: new Date(), 
      id: 'cm9', 
      ownerId: 'me', 
      users: {name: 'moose'}
    },
    {
      blogRepliesToId: 'blog1',
      comment: 'cm0 - replies to cm8', 
      commentRepliesToId: 'cm9', 
      createdAt: new Date(), 
      id: 'cm0', 
      ownerId: 'me', 
      users: {name: 'moose'}
    },
  ];

  const convertedComments = convertComments(testComments);

  //TODO change the blogID value passed in after testing
  return (
    <div className="">
      {convertedComments.map(comment => <Comment {...comment} blogId='d_blog1' key={comment.id} />)}
      <SignOutButton />
    </div>
  );
}
