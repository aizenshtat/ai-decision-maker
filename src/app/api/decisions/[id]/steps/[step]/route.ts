// src/app/api/decisions/[id]/steps/[step]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../auth/[...nextauth]/route'
import { getAiSuggestion } from '@/services/aiSuggestionService'
import { AppError, handleApiError } from '@/utils/errorHandling'

export async function GET(
  request: Request,
  { params }: { params: { id: string; step: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new AppError('Unauthorized', 401)
    }

    const { id, step } = params
    const decision = await prisma.decision.findUnique({
      where: { id },
      include: { framework: true },
    })

    if (!decision) {
      throw new AppError('Decision not found', 404)
    }

    if (decision.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
    }

    const steps = Array.isArray(decision.framework.steps) ? decision.framework.steps : 
                  (typeof decision.framework.steps === 'string' ? JSON.parse(decision.framework.steps) : []);

    const stepIndex = parseInt(step)
    if (!steps[stepIndex]) {
      throw new AppError('Step not found', 404)
    }

    const currentStep = steps[stepIndex]
    
    const allStepData: Record<string, any> = typeof decision.data === 'string' 
      ? JSON.parse(decision.data || '{}')
      : decision.data || {};

    const savedData = allStepData[currentStep.title] || {}
    const aiSuggestionKey = `${currentStep.title}_ai_suggestion`

    let aiSuggestion = allStepData[aiSuggestionKey] || null;

    if (!aiSuggestion) {
      const context: Record<string, any> = {
        initialQuestion: decision.question,
        ...allStepData
      };
      aiSuggestion = await getAiSuggestion(decision.frameworkId, stepIndex, context);
      
      // Save the new AI suggestion
      allStepData[aiSuggestionKey] = aiSuggestion;
      await prisma.decision.update({
        where: { id },
        data: { data: allStepData },
      });
    }

    return NextResponse.json({ 
      currentStep, 
      allStepData, 
      savedData,
      aiSuggestion
    })

  } catch (error) {
    return handleApiError(error)
  }
}