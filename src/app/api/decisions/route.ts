// src/app/api/decisions/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decisions = await prisma.decision.findMany({
      where: { userId: session.user.id },
      include: { framework: true },
    })

    const formattedDecisions = decisions.map(decision => {
      let steps = [];
      try {
        if (typeof decision.framework.steps === 'string') {
          const parsedSteps = JSON.parse(decision.framework.steps);
          steps = Array.isArray(parsedSteps.steps) ? parsedSteps.steps : [];
        } else if (Array.isArray(decision.framework.steps)) {
          steps = decision.framework.steps;
        }
      } catch (error) {
        console.error('Error parsing steps:', error);
      }

      return {
        id: decision.id,
        question: decision.question,
        framework: decision.framework.name,
        createdAt: decision.createdAt.toISOString(),
        status: decision.status,
        currentStep: decision.currentStep,
        totalSteps: steps.length,
      };
    })

    return NextResponse.json(formattedDecisions)
  } catch (error) {
    console.error('Error fetching decisions:', error)
    return NextResponse.json({ error: 'An error occurred while fetching decisions' }, { status: 500 })
  }
}