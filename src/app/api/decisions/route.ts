// src/app/api/decisions/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'
import { AppError, handleApiError } from '@/utils/errorHandling'
import { parseSteps } from '@/utils/frameworkUtils'
import { Decision } from '@/types/decision'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const decisions = await prisma.decision.findMany({
      where: { userId: session.user.id },
      include: {
        framework: true,
        feedbacks: {
          select: {
            rating: true,
            comment: true,
          },
          take: 1, // Assuming we only want the latest feedback
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    const formattedDecisions = decisions.map(decision => ({
      ...decision,
      createdAt: decision.createdAt.toISOString(),
      status: decision.status as 'in_progress' | 'completed',
      summary: decision.summary || undefined,
      framework: {
        ...decision.framework,
        steps: parseSteps(decision.framework.steps)
      },
      feedback: decision.feedbacks[0] || null,
      feedbacks: undefined,
    }))

    return NextResponse.json(formattedDecisions)
  } catch (error) {
    return handleApiError(error)
  }
}