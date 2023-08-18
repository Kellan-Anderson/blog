import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import generateUID from "~/lib/helpers/generateUID";
import { db, supabase } from "~/server/db";
import { blogsAndImages, images } from "~/server/schema";

export async function POST(request: NextRequest) {
  // Get the user object for the user that is making the request
  const user = await currentUser();

  // Setup the formdata object to get data from
  const data = await request.formData();

  // Validate the file is attached
  const file: File | null = data.get('file') as unknown as File;
  if(!file) return NextResponse.json({ message: 'Did not receive file' }, { status: 400 });

  // Look to see if the filename is attached. If it isnt, set it to the files default name
  let filename: string | null = data.get('filename') as unknown as string
  if(!filename) filename = file.name;

  // Get the user ID from the request => validates the same person who uploaded the image is the one requesting the API
  const requestUserId = data.get('uid');
  if(!user || user.id !== requestUserId?.toString()) 
    return NextResponse.json({ message: 'User not authorized' }, { status: 401 });

  try {
    // Upload the file to the storage bucket
    const { data: uploadData, error } = await supabase.storage.from('blog_images').upload(`${user.id}/${filename}`, file);
    // Return error if there was an upload issue
    if(error) return NextResponse.json({ message: 'Error', error}, { status: 500 });

    // Get the public url for the image
    const path = uploadData.path;
    const { data: publicUrlData } = supabase.storage.from('blog_images').getPublicUrl(path);

    const blogId = data.get('blogId')?.toString();
    const imageId = generateUID('image')
    await db.insert(images).values({
      id: imageId,
      imageUrl: publicUrlData.publicUrl,
      imageName: filename,
      ownedBy: user.id
    });
    if(blogId) {
      await db.insert(blogsAndImages).values({
        blogId,
        imageId
      });
    }

    // Return success message
    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      name: filename,
      id: imageId
    }, { status: 201 });
  } catch (e) {
    console.log('Error uploading image: ', e);
    return NextResponse.json({ message: 'error' }, { status: 500 })
  }
}