import { NextRequest, NextResponse } from 'next/server';
import { addMessage, getMessageCount } from '@/lib/db';
import { parseSmsMessage, formatPhoneNumber } from '@/lib/sms-parser';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.subject || !body.message) {
            return NextResponse.json(
                { error: 'Missing required fields: subject and message' },
                { status: 400 }
            );
        }

        // Parse message using SMS Forwarder parser
        const parsed = parseSmsMessage(body);
        const formattedSender = formatPhoneNumber(parsed.sender);

        // Save message to database with formatted phone number
        const message = await addMessage(formattedSender, parsed.content);

        return NextResponse.json({
            success: true,
            message_id: message.id,
            timestamp: message.createdAt,
            sender: formattedSender
        }, { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    const count = await getMessageCount();

    return NextResponse.json({
        status: 'ok',
        message_count: count,
        timestamp: Date.now()
    });
}
