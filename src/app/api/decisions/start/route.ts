// src/app/api/decisions/start/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'
import { PERSONAL_DECISION_FRAMEWORK } from '@/lib/decisionFramework'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { question } = body

  if (!question) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 })
  }

  try {
    const newDecision = await prisma.decision.create({
      data: {
        userId: session.user.id,
        question: question,
        framework: 'personal',
        data: {},
        currentStep: 0,
        status: 'in_progress'
      }
    })

    return NextResponse.json({
      decision_id: newDecision.id,
      steps: PERSONAL_DECISION_FRAMEWORK.steps,
      total_steps: PERSONAL_DECISION_FRAMEWORK.steps.length
    })
  } catch (error) {
    console.error('Error starting decision:', error)
    return NextResponse.json({ error: 'Error starting decision' }, { status: 500 })
  }
}