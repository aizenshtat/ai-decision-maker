// src/app/api/decisions/[id]/feedback/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { AppError, handleApiError } from '@/utils/errorHandling'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
    }

    const { id } = params
    const { rating, comment } = await request.json()

    const decision = await prisma.decision.findUnique({
      where: { id },
    })

    if (!decision) {
      throw new AppError('Decision not found', 404)
    }

    if (decision.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        decisionId: id,
        rating,
        comment,
      },
    })

    return NextResponse.json({ message: 'Feedback submitted successfully' }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}