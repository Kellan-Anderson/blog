import { clerkClient } from "@clerk/nextjs";
import { IncomingHttpHeaders } from "http";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { db } from "~/server/db";
import { users } from "~/server/schema";

const webhookSecret = process.env.WEBHOOK_SECRET || '';

type EventType = 'user.created' | 'user.updated' | '*'

type Event = {
  data: Record<string, string | null>,
  object: 'event',
  type: EventType
}

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    'svix-id': headersList.get('svix-id'),
    'svix-timestamp': headersList.get('svix-timestamp'),
    'svix-signature': headersList.get('svix-signature'),
  }
  const wh = new Webhook(webhookSecret);
  let event: Event | null;
  try {
    event = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch(err) {
    console.log((err as Error).message);
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = event.type;
  if(eventType === 'user.created' || eventType === 'user.updated') {
    const {
      id,
      first_name,
      last_name,
      image_url
    } = event.data;

    console.log('Received from event: ', {
      id,
      name: `${first_name}${last_name ? ' ' + last_name : ''}`,
      profilePictureUrl: image_url
    })
    
    await db.insert(users).values({
      id: id ?? '',
      name: `${first_name}${last_name ? ' ' + last_name : ''}`,
      profilePictureUrl: image_url
    });

    return NextResponse.json({
      message: `Event: ${eventType}`
    }, { status: 200 });
  }
  return NextResponse.json({
    message: `Event: ${eventType}`
  }, { status: 200 });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;