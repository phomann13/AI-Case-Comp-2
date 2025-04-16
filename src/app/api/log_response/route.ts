import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function POST(request: NextRequest) {
    const body = await request.json();
    const { customerName, contact, issueType, urgency, orderNumber, comments, priorityScore, actionDate } = body;

    const newAIResponse = await prisma.aIResponses.create({
        data: { customerName: customerName ?? '', contact: contact ?? '', issueType: issueType ?? '', urgency: urgency ?? '', orderNumber: orderNumber ?? '', comments: comments ?? '', priorityScore: priorityScore ?? 0, actionDate: actionDate ?? '' }
    })
    return NextResponse.json(newAIResponse);
}