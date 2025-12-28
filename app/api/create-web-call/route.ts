import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

// Initialize Retell SDK
// API Key should be in .env.local as RETELL_API_KEY
const retell = new Retell({
    apiKey: process.env.RETELL_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        // Parse request body if needed, or just use default agent ID
        const body = await req.json().catch(() => ({}));
        const agent_id = body.agent_id || process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

        if (!process.env.RETELL_API_KEY) {
            return NextResponse.json(
                { error: 'Missing RETELL_API_KEY in environment variables' },
                { status: 500 }
            );
        }

        if (!agent_id) {
            return NextResponse.json(
                { error: 'Missing Agent ID. Provide it in body or set NEXT_PUBLIC_RETELL_AGENT_ID' },
                { status: 400 }
            );
        }

        const webCallResponse = await retell.call.createWebCall({
            agent_id: agent_id,
        });

        return NextResponse.json(webCallResponse);
    } catch (error) {
        console.error('Error creating Retell web call:', error);
        return NextResponse.json(
            { error: 'Failed to initiate call' },
            { status: 500 }
        );
    }
}
