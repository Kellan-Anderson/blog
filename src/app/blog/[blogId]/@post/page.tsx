import { eq } from "drizzle-orm";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { db } from "~/server/db";
import { blogs } from "~/server/schema";
import { Separator } from "~/components/ui/separator"
import dayjs from "dayjs";

export default async function BlogPost({ params }: { params: { blogId: string } }) {

  const blogId = params.blogId;

  const blogPost = await db.query.blogs.findFirst({
    where: eq(blogs.id, blogId),
    columns: {
      content: true,
      createdAt: true,
      description: true,
      id: true,
      lastUpdated: true,
      title: true,
    },
  });

  if(!blogPost) return <div className="h-screen w-full">Blog post not found</div>;

  const { title, description, content, createdAt, lastUpdated } = blogPost;

  return (
    <>
      <section className="border border-black flex flex-col gap-2">
        <div id='title' className="w-full flex justify-start mt-4">
          <h1 className="text-6xl font-semibold">
            {title}
          </h1>
        </div>
        <div className="pl-2">
          <div id='description'>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div id='meta' className="flex flex-row gap-2 text-sm text-gray-500">
            <h2>Created at: {dayjs(createdAt).format('ddd, MMM D, YYYY h:mm')}</h2>
            <Separator orientation="vertical" className="w-[2px] rounded-full"/>
            <h2>Last updated: {dayjs(lastUpdated).format('ddd, MMM D, YYYY h:mm')}</h2>
          </div>
        </div>
      </section>
      <article className="pt-4">
        <ReactMarkdown className="markdown text-stone-900 pl-2">
          {content ? content : 'Blog has no content'}
        </ReactMarkdown>
      </article>
    </>
  );
}