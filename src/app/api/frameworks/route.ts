import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'
import { AppError, handleApiError } from '@/utils/errorHandling'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
    }

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
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      throw new AppError('Not authenticated', 401)
    }

    const { name, description, steps, cloneFrom } = await request.json()

    let frameworkData;

    if (cloneFrom) {
      const sourceFramework = await prisma.framework.findUnique({
        where: { id: cloneFrom }
      })

      if (!sourceFramework) {
        throw new AppError('Source framework not found', 404)
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
    return handleApiError(error)
  }
}