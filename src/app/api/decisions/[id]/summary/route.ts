import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateDecisionSummary } from '@/services/aiSuggestionService'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const decision = await prisma.decision.findUnique({
      where: { id },
      include: {
        user: true,
        feedbacks: true
      },
    });

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    let summary = decision.summary;

    if (!summary) {
      // Generate summary if it doesn't exist
      const data = decision.data ? JSON.parse(decision.data as string) : [];
      summary = await generateDecisionSummary(decision.question, data);
      
      // Save the generated summary
      await prisma.decision.update({
        where: { id },
        data: { summary },
      });
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error fetching or generating decision summary:', error);
    return NextResponse.json({ error: 'An error occurred while fetching or generating the decision summary' }, { status: 500 });
  }
}