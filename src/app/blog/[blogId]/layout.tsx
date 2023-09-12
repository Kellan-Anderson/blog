import React from "react";

export default function BlogPostLayout(props: {
  post: React.ReactNode,
  comments: React.ReactNode
}) {
  return (
    <div className="w-full bg-slate-700 text-white">
      <div className="flex flex-col mx-6 pl-2 h-screen">
        {props.post}
        {props.comments}
      </div>
    </div>
  );
}7