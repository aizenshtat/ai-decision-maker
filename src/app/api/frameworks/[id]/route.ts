import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { id } = params
    const framework = await prisma.framework.findUnique({
      where: { id },
    })

    if (!framework) {
      return NextResponse.json({ error: 'Framework not found' }, { status: 404 })
    }

    if (framework.userId !== session.user.id && framework.id !== 'default') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(framework)
  } catch (error) {
    console.error('Error fetching framework:', error)
    return NextResponse.json({ error: 'An error occurred while fetching the framework' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { id } = params
    const updatedFramework = await request.json()

    const framework = await prisma.framework.findUnique({
      where: { id },
    })

    if (!framework) {
      return NextResponse.json({ error: 'Framework not found' }, { status: 404 })
    }

    if (framework.id === 'default') {
      return NextResponse.json({ error: 'Cannot edit default framework' }, { status: 403 })
    }

    if (framework.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const result = await prisma.framework.update({
      where: { id },
      data: updatedFramework,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating framework:', error)
    return NextResponse.json({ error: 'An error occurred while updating the framework' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { id } = params

    const framework = await prisma.framework.findUnique({
      where: { id }
    })

    if (!framework) {
      return NextResponse.json({ error: 'Framework not found' }, { status: 404 })
    }

    if (framework.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.framework.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Framework deleted successfully' })
  } catch (error) {
    console.error('Error deleting framework:', error)
    return NextResponse.json({ error: 'An error occurred while deleting the framework' }, { status: 500 })
  }
}