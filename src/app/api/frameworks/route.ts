import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const frameworks = await prisma.framework.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { id: 'default' }
        ]
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['name']
    })

    return NextResponse.json(frameworks)
  } catch (error) {
    console.error('Error fetching frameworks:', error)
    return NextResponse.json({ error: 'An error occurred while fetching frameworks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { name, description, steps } = await request.json()

    const framework = await prisma.framework.create({
      data: {
        name,
        description,
        steps,
        userId: session.user.id,
      },
    })

    return NextResponse.json(framework)
  } catch (error) {
    console.error('Error creating framework:', error)
    return NextResponse.json({ error: 'An error occurred while creating the framework' }, { status: 500 })
  }
}