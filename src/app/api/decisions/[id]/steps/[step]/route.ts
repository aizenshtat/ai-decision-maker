// src/app/api/decisions/[id]/steps/[step]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../auth/[...nextauth]/route'
import { getAiSuggestion } from '@/services/aiSuggestionService'

export async function GET(
  request: Request,
  { params }: { params: { id: string; step: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, step } = params
    const decision = await prisma.decision.findUnique({
      where: { id },
      include: { framework: true },
    })

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    if (decision.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const steps = Array.isArray(decision.framework.steps) ? decision.framework.steps : 
                  (typeof decision.framework.steps === 'string' ? JSON.parse(decision.framework.steps) : []);

    const stepIndex = parseInt(step)
    if (!steps[stepIndex]) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
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
      console.log(`New AI suggestion generated for step ${stepIndex}`);
      
      // Save the new AI suggestion
      allStepData[aiSuggestionKey] = aiSuggestion;
      await prisma.decision.update({
        where: { id },
        data: { data: allStepData },
      });
    } else {
      console.log(`Using existing AI suggestion for step ${stepIndex}`);
    }

    return NextResponse.json({ 
      currentStep, 
      allStepData, 
      savedData,
      aiSuggestion
    })

  } catch (error) {
    console.error('Error fetching step data:', error)
    return NextResponse.json({ error: 'An error occurred while fetching the step data' }, { status: 500 })
  }
}