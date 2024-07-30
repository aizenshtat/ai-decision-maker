import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateDecisionSummary } from '@/services/aiSuggestionService'
import { AppError, handleApiError } from '@/utils/errorHandling'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
    }

    const id = params.id;
    const decision = await prisma.decision.findUnique({
      where: { id },
      include: {
        user: true,
        feedbacks: true,
        framework: true
      },
    });

    if (!decision) {
      throw new AppError('Decision not found', 404)
    }

    if (decision.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
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

    return NextResponse.json({ summary, frameworkName: decision.framework.name });
  } catch (error) {
    return handleApiError(error)
  }
}