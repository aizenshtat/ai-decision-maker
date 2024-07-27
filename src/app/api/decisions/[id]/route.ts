// src/app/api/decisions/[id]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = params

  try {
    const decision = await prisma.decision.findUnique({
      where: { id }
    })

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    if (decision.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.decision.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Decision deleted successfully' })
  } catch (error) {
    console.error('Error deleting decision:', error)
    return NextResponse.json({ error: 'An error occurred while deleting the decision' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = params.id
    const decision = await prisma.decision.findUnique({
      where: { id },
      include: {
        user: true,
        feedbacks: true,
        framework: true // Include the framework
      },
    })

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    // Parse the steps data if it's stored as a JSON string
    const parsedSteps = decision.steps ? JSON.parse(decision.steps as string) : [];

    const formattedDecision = {
      ...decision,
      steps: parsedSteps,
    }

    return NextResponse.json(formattedDecision)
  } catch (error) {
    console.error('Error fetching decision:', error)
    return NextResponse.json({ error: 'An error occurred while fetching the decision' }, { status: 500 })
  }
}