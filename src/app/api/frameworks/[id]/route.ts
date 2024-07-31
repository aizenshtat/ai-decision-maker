import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'
import { AppError, handleApiError } from '@/utils/errorHandling'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const { id } = params
    const framework = await prisma.framework.findUnique({
      where: { id },
    })

    if (!framework) {
      throw new AppError('Framework not found', 404)
    }

    if (framework.userId !== session.user.id && framework.id !== 'default') {
      throw new AppError('Unauthorized', 403)
    }

    return NextResponse.json(framework)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const { id } = params
    const updatedFramework = await request.json()

    const framework = await prisma.framework.findUnique({
      where: { id },
    })

    if (!framework) {
      throw new AppError('Framework not found', 404)
    }

    if (framework.id === 'default') {
      throw new AppError('Cannot edit default framework', 403)
    }

    if (framework.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
    }

    const result = await prisma.framework.update({
      where: { id },
      data: updatedFramework,
    })

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const { id } = params

    const framework = await prisma.framework.findUnique({
      where: { id },
      include: { decisions: true }
    })

    if (!framework) {
      throw new AppError('Framework not found', 404)
    }

    if (framework.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
    }

    if (framework.decisions.length > 0) {
      return NextResponse.json({ 
        message: 'Framework cannot be deleted because it is associated with existing decisions. Would you like to archive it instead?',
        canArchive: true
      }, { status: 400 })
    }

    await prisma.framework.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Framework deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new AppError('User not found', 404)
    }

    const { id } = params
    const { archived } = await request.json()

    console.log('Received PATCH request:', { id, archived })

    const framework = await prisma.framework.findUnique({
      where: { id }
    })

    if (!framework) {
      throw new AppError('Framework not found', 404)
    }

    if (framework.userId !== session.user.id) {
      throw new AppError('Unauthorized', 403)
    }

    console.log('Updating framework:', { id, archived })

    const updatedFramework = await prisma.framework.update({
      where: { id },
      data: { archived }
    })

    console.log('Framework updated successfully:', updatedFramework)

    return NextResponse.json(updatedFramework)
  } catch (error) {
    console.error('Error in PATCH route:', error)
    return handleApiError(error)
  }
}