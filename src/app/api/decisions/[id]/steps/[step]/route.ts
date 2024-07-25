// src/app/api/decisions/[id]/steps/[step]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../auth/[...nextauth]/route'
import { PERSONAL_DECISION_FRAMEWORK } from '@/lib/decisionFramework'

export async function GET(
  request: Request,
  { params }: { params: { id: string; step: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id, step } = params
  const stepIndex = parseInt(step)

  try {
    const decision = await prisma.decision.findUnique({
      where: { id: id }
    })

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    if (decision.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const frameworkStep = PERSONAL_DECISION_FRAMEWORK.steps[stepIndex]
    if (!frameworkStep) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }

    const savedData = decision.data[frameworkStep.title] || {}
    const aiSuggestion = decision.data[`${frameworkStep.title}_ai_suggestion`] || ""

    // Include all previous step data
    const allStepData = {}
    for (let i = 0; i <= stepIndex; i++) {
      const currentStep = PERSONAL_DECISION_FRAMEWORK.steps[i]
      allStepData[currentStep.title] = decision.data[currentStep.title] || {}
    }

    return NextResponse.json({
      step: frameworkStep,
      saved_data: savedData,
      ai_suggestion: aiSuggestion,
      all_step_data: allStepData
    })
  } catch (error) {
    console.error('Error getting step:', error)
    return NextResponse.json({ error: 'Error getting step' }, { status: 500 })
  }
}