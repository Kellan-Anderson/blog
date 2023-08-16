import { clerkClient } from "@clerk/nextjs";
import { IncomingHttpHeaders } from "http";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";

const webhookSecret = process.env.WEBHOOK_SECRET || '';

type EventType = 'user.created' | 'user.updated' | '*'

type Event = {
  data: Record<string, string | number>,
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
    const { id, ...attributes } = event.data;
    console.log({
      id,
      attributes,
      message: `Received event type: ${eventType}`
    });
  } else console.log({
    message: 'Got type: *',
    data: event.data
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;