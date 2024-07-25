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
  console.log('GET request received for decision step')
  console.log('Params:', params)

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    console.log('User not authenticated')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const decisionId = params.id
    const stepIndex = parseInt(params.step)

    console.log('Fetching decision:', decisionId)
    const decision = await prisma.decision.findUnique({
      where: { id: decisionId },
    })

    if (!decision) {
      console.log('Decision not found')
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    console.log('Decision found:', decision)

    let steps = decision.steps
    if (typeof steps === 'object' && 'steps' in steps && Array.isArray(steps.steps)) {
      steps = steps.steps
    } else if (!Array.isArray(steps)) {
      console.log('Invalid steps data:', steps)
      return NextResponse.json({ error: 'Invalid steps data' }, { status: 500 })
    }

    console.log('Processed steps:', steps)

    if (stepIndex < 0 || stepIndex >= steps.length) {
      console.log('Invalid step index:', stepIndex)
      return NextResponse.json({ error: 'Invalid step index' }, { status: 400 })
    }

    const step = steps[stepIndex]
    console.log('Step data:', step)

    if (!step || typeof step !== 'object') {
      console.log('Invalid step data:', step)
      return NextResponse.json({ error: 'Invalid step data' }, { status: 500 })
    }

    return NextResponse.json(step)
  } catch (error) {
    console.error('Error getting step:', error)
    return NextResponse.json({ error: 'An error occurred while getting the step' }, { status: 500 })
  }
}