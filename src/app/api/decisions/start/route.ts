// src/app/api/decisions/start/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  console.log('Session:', JSON.stringify(session, null, 2))

  if (!session || !session.user) {
    console.log('Not authenticated or user not found in database')
    return NextResponse.json({ error: 'Not authenticated', redirect: '/auth/signin' }, { status: 401 })
  }

  try {
    const { question, frameworkId } = await request.json()
    console.log('Received question:', question)
    console.log('Received frameworkId:', frameworkId)

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      console.log('User not found:', session.user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.log('User found:', user.id)

    const framework = await prisma.framework.findUnique({
      where: { id: frameworkId },
    })

    if (!framework) {
      console.log('Framework not found')
      return NextResponse.json({ error: 'Framework not found' }, { status: 404 })
    }
    console.log('Framework found:', framework.id)

    const decision = await prisma.decision.create({
      data: {
        question,
        userId: user.id,
        frameworkId: framework.id,
        data: {},
        currentStep: 0,
        status: 'in_progress',
      },
    })
    console.log('Decision created:', decision)

    return NextResponse.json(decision)
  } catch (error) {
    console.error('Error starting decision:', error)
    return NextResponse.json({ error: 'An error occurred while starting the decision' }, { status: 500 })
  }
}