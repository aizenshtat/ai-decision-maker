// src/app/api/decisions/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'
import { PERSONAL_DECISION_FRAMEWORK } from '@/lib/decisionFramework'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const decisions = await prisma.decision.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    const formattedDecisions = decisions.map(decision => ({
      id: decision.id,
      question: decision.question,
      framework: decision.framework,
      createdAt: decision.createdAt.toISOString(),
      status: decision.status,
      currentStep: decision.currentStep,
      totalSteps: PERSONAL_DECISION_FRAMEWORK.steps.length
    }))

    return NextResponse.json(formattedDecisions)
  } catch (error) {
    console.error('Error fetching decisions:', error)
    return NextResponse.json({ error: 'An error occurred while fetching decisions' }, { status: 500 })
  }
}