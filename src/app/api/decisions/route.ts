// src/app/api/decisions/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'
import { AppError, handleApiError } from '@/utils/errorHandling'
import { parseSteps } from '@/utils/frameworkUtils'
import { Decision } from '@/types/decision'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
    }

    const decisions = await prisma.decision.findMany({
      where: { userId: session.user.id },
      include: { framework: true },
    })

    const formattedDecisions: Decision[] = decisions.map(decision => ({
      ...decision,
      createdAt: decision.createdAt.toISOString(),
      status: decision.status as 'in_progress' | 'completed',
      summary: decision.summary || undefined,
      framework: {
        ...decision.framework,
        steps: parseSteps(decision.framework.steps)
      }
    }))

    return NextResponse.json(formattedDecisions)
  } catch (error) {
    return handleApiError(error)
  }
}