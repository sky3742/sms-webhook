import { addMessage, getMessageCount } from "@/lib/services/message";
import { getAllSubscriptions } from "@/lib/services/pushSubscription";
import { sendPushNotificationToAll } from "@/lib/services/webPush";
import { NextRequest, NextResponse } from "next/server";

type WebhookPayload = {
  sender?: unknown;
  message?: unknown;
  token?: unknown;
};

function normalizeSender(sender: string): string {
  const digits = sender.replace(/\D/g, "");
  if (!digits) {
    return sender.trim();
  }
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WebhookPayload;
    const configuredToken = process.env.WEBHOOK_AUTH_TOKEN;
    const headerToken =
      request.headers.get("x-webhook-token") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const payloadToken =
      typeof body.token === "string" ? body.token.trim() : undefined;
    const providedToken = headerToken || payloadToken;

    if (configuredToken && providedToken !== configuredToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      typeof body.sender !== "string" ||
      !body.sender.trim() ||
      typeof body.message !== "string" ||
      !body.message.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields: sender and message" },
        { status: 400 },
      );
    }

    const formattedSender = normalizeSender(body.sender);

    // Save message to database with formatted phone number
    const message = await addMessage(formattedSender, body.message.trim());

    const result = await getAllSubscriptions();

    const subscriptions = result.map((row) => ({
      endpoint: row.endpoint,
      keys: {
        p256dh: row.p256dh,
        auth: row.auth,
      },
    }));

    // Send push notification to all subscribers
    const payload = {
      title: `New SMS from ${formattedSender}`,
      body: body.message.trim(),
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: {
        url: "/",
        messageId: message.id,
      },
    };

    const sentCount = await sendPushNotificationToAll(subscriptions, payload);

    console.log(`Push notification sent to ${sentCount} subscriber(s)`);

    return NextResponse.json(
      {
        success: true,
        message_id: message.id,
        timestamp: message.createdAt,
        sender: formattedSender,
        notifications_sent: sentCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  const count = await getMessageCount();

  return NextResponse.json({
    status: "ok",
    message_count: count,
    timestamp: Date.now(),
  });
}
