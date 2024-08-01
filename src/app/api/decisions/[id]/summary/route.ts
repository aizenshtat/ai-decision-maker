import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateDecisionSummary } from '@/services/aiSuggestionService'
import { AppError, handleApiError } from '@/utils/errorHandling'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../auth/[...nextauth]/options'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const { id } = params
    const decision = await prisma.decision.findUnique({
      where: { id },
      include: {
        framework: true,
        feedbacks: {
          select: {
            rating: true,
            comment: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!decision) {
      throw new AppError('Decision not found', 404)
    }

    if (decision.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
    }

    return NextResponse.json({
      summary: decision.summary,
      frameworkName: decision.framework.name,
      feedback: decision.feedbacks[0] || null,
    })
  } catch (error) {
    return handleApiError(error)
  }
}