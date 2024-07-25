// src/app/api/decisions/[id]/suggestions/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../auth/[...nextauth]/route'
import { getAiSuggestion } from '@/services/aiSuggestionService'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = params
  const { searchParams } = new URL(request.url)
  const step = searchParams.get('step')

  if (!step) {
    return NextResponse.json({ error: 'Step parameter is required' }, { status: 400 })
  }

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

    // Prepare context for AI suggestion
    const context: Record<string, any> = {
      initialQuestion: decision.question
    }

    // Safely spread decision.data if it's an object
    if (typeof decision.data === 'object' && decision.data !== null) {
      Object.assign(context, decision.data as Record<string, any>)
    }

    // Get AI suggestion
    const aiSuggestion = await getAiSuggestion(parseInt(step), context)

    // Always return a 200 status, even if there was an error in generating the suggestion
    return NextResponse.json(aiSuggestion)
  } catch (error) {
    console.error('Error in suggestion route:', error)
    return NextResponse.json({ 
      suggestion: "An unexpected error occurred while processing your request.",
      pre_filled_data: {}
    }, { status: 200 })
  }
}