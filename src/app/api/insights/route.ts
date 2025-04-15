import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();


import { NextRequest, NextResponse } from 'next/server';

type Message = { role: string; content: string };
const sessions = new Map<string, Message[]>();
// Define the system's instruction/context
const systemPrompt = () => `
 You are a data scientist helping to review IT service ticket data for a non-profit food bank. 
 Each ticket includes an initial desciption that starts the interaction and a  "comments" field written by users and IT help.
 As well as some fields for category, priority, and status.
 Idenfify potentials trends in interactions and provide insights on how to improve the service.
 Provide a summary of the data and the insights.

`;


function getSessionId(req: NextRequest): string {
    let sessionId = req.headers.get('session-id');
    if (!sessionId) {
        sessionId = crypto.randomUUID(); // Generate a new session ID
    }
    return sessionId;
}

export async function POST(req: NextRequest) {
    const { fromDate, toDate } = await req.json();
    const sessionId = getSessionId(req);
    const issues = await prisma.issue.findMany({
        select: {
            summary: true,
            issueKey: true,
            status: true,
            assignee: true,
            description: true,
            partnerNames: true,
            causeOfIssue: true,
            comments: true,
            region: true,
            relevantDepartments: true,
            requestType: true,
            resolutionAction: true,
            timeToFirstResponse: true,
            timeToResolution: true
            
        },
        where: {
            created: {
                gte: new Date(fromDate),
                lte: new Date(toDate),
            },
        },
    });
    // Retrieve or initialize session data
    let messages = sessions.get(sessionId) || [{ role: 'system', content: systemPrompt() }];
    messages.push({ role: 'user', content: JSON.stringify(issues) });

    // Fetch response from OpenAI
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: messages,
        }),
    });
    const data = await openAiResponse.json();
    console.log(data);
    try {
        const botReply = data.choices[0].message.content;
        console.log(botReply);
        // console.log(data);
        // Append assistant's reply to messages and store in the session
        messages.push({ role: 'assistant', content: botReply });
        sessions.set(sessionId, messages);

        return NextResponse.json({ reply: botReply, sessionId }, { headers: { 'session-id': sessionId } });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get insights' }, { status: 500 });
    }
}
