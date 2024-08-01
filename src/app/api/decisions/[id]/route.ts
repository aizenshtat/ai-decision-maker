// src/app/api/decisions/[id]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/options'
import { AppError, handleApiError } from '@/utils/errorHandling'
import { Framework, Step } from '@/types/framework'
import { Decision } from '@/types/decision'
import { parseSteps } from '@/utils/frameworkUtils'

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
        user: true,
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
        framework: true
      },
    })

    if (!decision) {
      throw new AppError('Decision not found', 404)
    }

    if (decision.userId !== session.user.id) {
      throw new AppError('Forbidden', 403)
    }

    const formattedDecision: Decision = {
      ...decision,
      createdAt: decision.createdAt.toISOString(),
      status: decision.status as 'in_progress' | 'completed',
      feedback: decision.feedbacks[0] 
        ? {
            rating: decision.feedbacks[0].rating,
            comment: decision.feedbacks[0].comment || undefined
          }
        : null,
      framework: {
        ...decision.framework,
        archived: decision.framework.archived,
        steps: parseSteps(decision.framework.steps)
      }
    }

    return NextResponse.json(formattedDecision)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
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
      where: { id }
    })

    if (!decision) {
      throw new AppError('Decision not found', 404)
    }

    if (decision.userId !== session.user.id) {
      throw new AppError('Forbidden', 403)
    }

    // Delete related feedback first
    await prisma.feedback.deleteMany({
      where: { decisionId: id }
    })

    // Then delete the decision
    await prisma.decision.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Decision and related feedback deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}