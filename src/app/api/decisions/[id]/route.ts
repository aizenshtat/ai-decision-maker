// src/app/api/decisions/[id]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'
import { AppError, handleApiError, createApiErrorResponse } from '@/utils/errorHandling'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
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

    let parsedSteps = [];
    if (decision.framework && decision.framework.steps) {
      try {
        parsedSteps = typeof decision.framework.steps === 'string' 
          ? JSON.parse(decision.framework.steps) 
          : decision.framework.steps;
      } catch (error) {
        console.error('Error parsing framework steps:', error);
      }
    }

    const formattedDecision = {
      ...decision,
      steps: parsedSteps,
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
    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
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