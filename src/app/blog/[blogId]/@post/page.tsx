import { eq } from "drizzle-orm";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { db } from "~/server/db";
import { blogs, users } from "~/server/schema";
import { Separator } from "~/components/ui/separator"
import dayjs from "dayjs";
import { Dot } from "~/components/ui/dot";

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
    with: {
      owner: {
        columns: {
          name: true
        }
      }
    }
  });

  if(!blogPost) return <div className="h-screen w-full">Blog post not found</div>;

  const { title, description, content, createdAt, lastUpdated } = blogPost;
  const author = blogPost.owner?.name ?? "Anonymous";

  return (
    <>
      <section id='blog-header' className="fixed right-6 left-6 pt-10 flex flex-col justify-center items-center z-10">
        <h1 id="title" className="text-6xl font-bold">
          {title}
        </h1>
        <p className="pt-1">{description}</p>
        <div className="flex flex-row items-center gap-2 text-sm text-slate-400">
          <p>By: {author}</p>
          <Dot />
          <p>Created at: {dayjs(createdAt).format('MMM DD, YYYY')}</p>
          <Dot />
          <p>Updated at: {dayjs(lastUpdated).format('MMM DD, YYYY')}</p>
        </div>
      </section>
      <article className="mt-40 z-20 border border-black rounded-t-3xl bg-slate-100 dark:bg-zinc-800">
        <div className="p-9">
          <ReactMarkdown className="markdown">
            {content ?? 'No blog'}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}