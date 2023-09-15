import React from "react";

export default function BlogPostLayout(props: {
  post: React.ReactNode,
  comments: React.ReactNode
}) {
  return (
    <>
      <div className="w-full text-white">
        <div className="flex flex-col px-6 h-screen relative">
          {props.post}
          {props.comments}
        </div>
      </div>
      <div className="fixed left-0 top-0 h-screen w-full flex flex-col z-0">
        <div className="grow bg-slate-900"></div>
        <div className="grow bg-gray-500 dark:bg-gray-800"></div>
      </div>
    </>
  );
}7