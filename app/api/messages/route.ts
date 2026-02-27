import { NextRequest, NextResponse } from 'next/server';
import { getAllMessages, getMessageCount, deleteMessage } from '@/lib/db';
import { formatPhoneNumber } from '@/lib/sms-parser';

// GET all messages
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        const messages = await getAllMessages(limit, offset);

        // Format sender phone numbers
        const formattedMessages = messages.map(msg => ({
            ...msg,
            sender: formatPhoneNumber(msg.subject)
        }));

        const count = await getMessageCount();

        return NextResponse.json({
            messages: formattedMessages,
            count,
            limit,
            offset
        });
    } catch (error) {
        console.error('GET messages error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE a message
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Message ID is required' },
                { status: 400 }
            );
        }

        const success = await deleteMessage(parseInt(id));

        if (success) {
            return NextResponse.json({
                success: true,
                message_id: id
            });
        } else {
            return NextResponse.json(
                { error: 'Message not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('DELETE message error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
