import convertComments from "~/lib/helpers/convertComments";
import { comment } from "~/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
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