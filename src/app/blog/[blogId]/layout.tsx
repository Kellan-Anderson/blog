import React from "react";

export default function BlogPostLayout(props: {
  post: React.ReactNode,
  comments: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-7 w-full">
      <div className="col-span-5 flex flex-col mx-6 pl-2">
        {props.post}
        {props.comments}
      </div>
    </div>
  );
}