// src/app/api/decisions/[id]/steps/[step]/submit/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../../auth/[...nextauth]/route'
import { getAiSuggestion, generateDecisionSummary } from '@/services/aiSuggestionService'
import { AppError, handleApiError } from '@/utils/errorHandling'
import { validateInput, required } from '@/utils/validation'

export async function POST(
  request: Request,
  { params }: { params: { id: string; step: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const { id, step } = params
    if (!id || !step) {
      throw new AppError('Missing required parameters', 400)
    }

    const idErrors = validateInput(id, [required])
    const stepErrors = validateInput(step, [required])

    if (idErrors.length > 0 || stepErrors.length > 0) {
      throw new AppError('Invalid input', 400)
    }

    const stepIndex = parseInt(step)
    if (isNaN(stepIndex)) {
      throw new AppError('Invalid step parameter', 400)
    }

    const body = await request.json()
    const { stepData, aiSuggestion } = body

    // Validate stepData and aiSuggestion here
    // The exact validation will depend on the structure of your data

    const decision = await prisma.decision.findUnique({
      where: { id },
      include: { framework: true }
    })

    if (!decision) {
      throw new AppError('Decision not found', 404)
    }

    if (decision.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
    }

    let frameworkSteps = [];
    try {
      if (typeof decision.framework.steps === 'string') {
        const parsedSteps = JSON.parse(decision.framework.steps);
        frameworkSteps = Array.isArray(parsedSteps.steps) ? parsedSteps.steps : [];
      } else if (Array.isArray(decision.framework.steps)) {
        frameworkSteps = decision.framework.steps;
      }
    } catch (error) {
      console.error('Error parsing framework steps:', error);
    }

    let currentData = {};
    try {
      if (typeof decision.data === 'string') {
        currentData = JSON.parse(decision.data);
      } else if (typeof decision.data === 'object' && decision.data !== null) {
        currentData = decision.data;
      }
    } catch (error) {
      console.error('Error parsing decision data:', error);
    }

    const updatedData = {
      ...currentData,
      [frameworkSteps[stepIndex].title]: stepData,
      [`${frameworkSteps[stepIndex].title}_ai_suggestion`]: aiSuggestion
    }

    const updatedDecision = await prisma.decision.update({
      where: { id: id },
      data: {
        data: updatedData,
        currentStep: stepIndex + 1,
        status: stepIndex + 1 >= frameworkSteps.length ? 'completed' : 'in_progress'
      }
    })

    if (updatedDecision.status === 'completed') {
      const summary = await generateDecisionSummary(updatedDecision.question, Object.values(updatedData))
      await prisma.decision.update({
        where: { id: id },
        data: { summary }
      })
      return NextResponse.json({ completed: true, summary })
    }

    return NextResponse.json({ completed: false })
  } catch (error) {
    return handleApiError(error)
  }
}