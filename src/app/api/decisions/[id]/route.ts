// src/app/api/decisions/[id]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'
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
        feedbacks: true,
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
      framework: {
        ...decision.framework,
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

    await prisma.decision.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Decision deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}