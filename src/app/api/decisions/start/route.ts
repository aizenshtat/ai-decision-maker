// src/app/api/decisions/start/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'
import { AppError, handleApiError, createApiErrorResponse } from '@/utils/errorHandling'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
    }

    const { question, frameworkId } = await request.json()
    if (!question || !frameworkId) {
      throw new AppError('Missing required fields', 400)
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const framework = await prisma.framework.findUnique({
      where: { id: frameworkId },
    })

    if (!framework) {
      throw new AppError('Framework not found', 404)
    }

    const decision = await prisma.decision.create({
      data: {
        question,
        userId: user.id,
        frameworkId: framework.id,
        data: {},
        currentStep: 0,
        status: 'in_progress',
      },
    })

    return NextResponse.json(decision)
  } catch (error) {
    return handleApiError(error)
  }
}