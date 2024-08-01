// src/app/api/frameworks/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/options'
import { AppError, handleApiError } from '@/utils/errorHandling'
import { Framework, Step } from '@/types/framework'
import { parseSteps } from '@/utils/frameworkUtils'
import { validateInput, required } from '@/utils/validation'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const rawFrameworks = await prisma.framework.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { id: 'default' }
        ]
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['name']
    })

    const frameworks: Framework[] = rawFrameworks.map((framework: any) => ({
      ...framework,
      steps: parseSteps(framework.steps)
    }))

    return NextResponse.json(frameworks)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const { name, description, steps, cloneFrom } = await request.json()

    let frameworkData;

    if (cloneFrom) {
      const cloneFromErrors = validateInput(cloneFrom, [required])
      if (cloneFromErrors.length > 0) {
        throw new AppError('Invalid clone source', 400)
      }

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
      const nameErrors = validateInput(name, [required])
      if (nameErrors.length > 0) {
        throw new AppError('Invalid framework name', 400)
      }

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