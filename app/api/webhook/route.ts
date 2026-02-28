import { addMessage, getMessageCount } from "@/lib/services/message";
import { getAllSubscriptions } from "@/lib/services/pushSubscription";
import { sendPushNotificationToAll } from "@/lib/services/webPush";
import { formatPhoneNumber, parseSmsMessage } from "@/lib/utils/sms-parser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields: subject and message" },
        { status: 400 },
      );
    }

    // Parse message using SMS Forwarder parser
    const parsed = parseSmsMessage(body);
    const formattedSender = formatPhoneNumber(parsed.sender);

    // Save message to database with formatted phone number
    const message = await addMessage(formattedSender, parsed.content);

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
      body: parsed.content,
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
