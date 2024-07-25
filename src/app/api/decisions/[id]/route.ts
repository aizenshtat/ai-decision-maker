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
      where: { id: id }
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