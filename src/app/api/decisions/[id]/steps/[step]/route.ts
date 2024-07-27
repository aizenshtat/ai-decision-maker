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
  console.log('GET request received for decision step')
  console.log('Params:', params)

  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, step } = params
    console.log('Fetching decision:', id)

    const decision = await prisma.decision.findUnique({
      where: { id },
      include: { framework: true },
    })

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    // Add this check
    if (decision.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    console.log('Decision found:', decision)

    let steps
    try {
      steps = typeof decision.framework.steps === 'string' 
        ? JSON.parse(decision.framework.steps)
        : decision.framework.steps;
      
      if (!Array.isArray(steps)) {
        throw new Error('Steps is not an array')
      }
    } catch (error) {
      console.error('Invalid steps data:', decision.framework.steps)
      return NextResponse.json({ error: 'Invalid steps data' }, { status: 500 })
    }

    const stepIndex = Number(step)
    if (!steps[stepIndex]) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }

    const currentStep = steps[stepIndex]
    
    // Handle decision.data safely
    const allStepData: Record<number, any> = typeof decision.data === 'string' 
      ? JSON.parse(decision.data || '{}')
      : decision.data || {};

    const savedData = allStepData[stepIndex] || {}

    // Get AI suggestion
    const context: Record<string, any> = {
      initialQuestion: decision.question,
      ...allStepData
    };

    let aiSuggestion;
    if (allStepData[currentStep.title] && allStepData[currentStep.title].ai_suggestion) {
      aiSuggestion = allStepData[currentStep.title].ai_suggestion;
    } else {
      aiSuggestion = await getAiSuggestion(decision.frameworkId, stepIndex, context);
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