import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { comments, insertCommentSchema } from "~/server/schema";

export async function POST(request: NextRequest) {
  try {
    const reqJson = await request.json();
    const date = new Date(reqJson.createdAt);
    const body = insertCommentSchema.parse({
      ...reqJson,
      createdAt: date
    });
    await db.insert(comments).values(body);
    return NextResponse.json({ message: 'Added comment' }, { status: 200 })
  } catch(err) {
    console.log('Error', err)
    return NextResponse.json({ message: 'There was an error adding comment' }, { status: 500 });
  }
}