// src/app/api/decisions/[id]/feedback/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = params
    const { rating, comment } = await request.json()

    const decision = await prisma.decision.findUnique({
      where: { id },
    })

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    if (decision.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        decisionId: id,
        rating,
        comment,
      },
    })

    return NextResponse.json({ message: 'Feedback submitted successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json({ error: 'An error occurred while submitting feedback' }, { status: 500 })
  }
}