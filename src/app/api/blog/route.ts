import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import generateUID from "~/lib/helpers/generateUID";
import { db } from "~/server/db";
import { blogs, blogsAndCategories, blogsAndImages, tags } from "~/server/schema";

export async function PUT(request: NextRequest) {
  try {
    console.log('Recieved:', request.body)

    const bodyParser = z.object({
      categoryIds: z.string().array(),
      imageIds: z.string().array(),
      tags: z.string().array(),
      content: z.string(),
      blogId: z.string(),
      title: z.string(),
      description: z.string()
    });
    const body = bodyParser.parse(await request.json());
    const blogId = body.blogId;

    // Await all deletions
    await Promise.all([
      db.delete(blogsAndCategories).where(eq(blogsAndCategories.blogId, blogId)),
      db.delete(blogsAndImages).where(eq(blogsAndImages.blogId, blogId)),
      db.delete(tags).where(eq(tags.blogId, blogId))
    ]);

    // Map details to structures acceptable by drizzle
    const uploadPromises: Promise<any>[] = [];

    // Re-upload categories
    const uploadCategories = body.categoryIds.map(categoryId => ({ blogId, categoryId }));
    if(uploadCategories.length) uploadPromises.push(
      db.insert(blogsAndCategories).values(uploadCategories)
    );

    // Re-upload images
    const uploadImages = body.imageIds.map(imageId => ({ blogId, imageId }));
    if(uploadImages.length) uploadPromises.push(
      db.insert(blogsAndImages).values(uploadImages)
    );

    // Re-upload tags
    const uploadTags = body.tags.map(tag => ({ tag, blogId, id: generateUID('tag') }));
    if(uploadTags.length) uploadPromises.push(
      db.insert(tags).values(uploadTags)
    );

    // Re-write blog details
    await Promise.all([
      ...uploadPromises,
      db.update(blogs).set({
        content: body.content,
        title: body.title,
        description: body.description
      }).where(eq(blogs.id, blogId))
    ]);

    return NextResponse.json({message: 'Saved blog'}, { status: 200 });
  } catch (err) {
    return NextResponse.json({message: `There was an error saving the blog. Message: ${err}`}, { status: 500 });
  }
}