import { db } from '~/server/db';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'; 

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const perPage = searchParams['perPage'] ?? '15';
  const pageNumber = searchParams['page'] ?? '1';

  const start = (Number(pageNumber) - 1) * Number(perPage);
  const end = start + Number(perPage);

  const posts = await db.query.blogs.findMany({
    offset: start,
    limit: end
  });

  return (
    <div className='flex flex-col'>
      {posts.map(post => (
        <a key={post.id} href={`/blog/${post.id}`}>
          <Card className='max-w-lg'>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {post.description}
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  )
}
