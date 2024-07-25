// src/app/api/decisions/[id]/steps/[step]/submit/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../../auth/[...nextauth]/route'
import { PERSONAL_DECISION_FRAMEWORK } from '@/lib/decisionFramework'
import { getAiSuggestion, generateDecisionSummary } from '@/services/aiSuggestionService'

export async function POST(
  request: Request,
  { params }: { params: { id: string; step: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id, step } = params
  const stepIndex = parseInt(step)
  const body = await request.json()
  const { stepData, aiSuggestion } = body

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

    // Update decision data
    const updatedData = {
      ...decision.data,
      [PERSONAL_DECISION_FRAMEWORK.steps[stepIndex].title]: stepData,
      [`${PERSONAL_DECISION_FRAMEWORK.steps[stepIndex].title}_ai_suggestion`]: aiSuggestion
    }

    const updatedDecision = await prisma.decision.update({
      where: { id: id },
      data: {
        data: updatedData,
        currentStep: stepIndex,
        status: stepIndex >= PERSONAL_DECISION_FRAMEWORK.steps.length - 1 ? 'completed' : 'in_progress'
      }
    })

    if (updatedDecision.status === 'completed') {
      const summary = await generateDecisionSummary(updatedDecision.data)
      await prisma.decision.update({
        where: { id: id },
        data: { summary }
      })
      return NextResponse.json({ completed: true, summary })
    }

    return NextResponse.json({ completed: false })
  } catch (error) {
    console.error('Error submitting step:', error)
    return NextResponse.json({ error: 'Error submitting step' }, { status: 500 })
  }
}