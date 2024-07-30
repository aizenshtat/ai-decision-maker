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
    const { name, description, steps, cloneFrom } = await request.json()

    let frameworkData;

    if (cloneFrom) {
      const sourceFramework = await prisma.framework.findUnique({
        where: { id: cloneFrom }
      })

      if (!sourceFramework) {
        return NextResponse.json({ error: 'Source framework not found' }, { status: 404 })
      }

      frameworkData = {
        name: `${sourceFramework.name} (Clone)`,
        description: sourceFramework.description,
        steps: sourceFramework.steps,
        userId: session.user.id,
      }
    } else {
      frameworkData = {
        name,
        description,
        steps: steps || [],
        userId: session.user.id,
      }
    }

    const framework = await prisma.framework.create({
      data: frameworkData,
    })

    return NextResponse.json(framework)
  } catch (error) {
    console.error('Error creating framework:', error)
    return NextResponse.json({ error: 'An error occurred while creating the framework' }, { status: 500 })
  }
}