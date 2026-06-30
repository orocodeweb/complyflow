import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, prisma } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const deadline = await prisma.deadline.findFirst({
      where: { id: params.id, userId: user.id },
    })

    if (!deadline) {
      return NextResponse.json({ error: 'Deadline not found' }, { status: 404 })
    }

    const body = await request.json()
    const updated = await prisma.deadline.update({
      where: { id: params.id },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        completedAt: body.completed ? new Date() : null,
      },
    })

    return NextResponse.json({ deadline: updated })
  } catch (error) {
    console.error('Deadline PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const deadline = await prisma.deadline.findFirst({
      where: { id: params.id, userId: user.id },
    })

    if (!deadline) {
      return NextResponse.json({ error: 'Deadline not found' }, { status: 404 })
    }

    await prisma.deadline.delete({ where: { id: params.id } })

    return NextResponse.json({ message: 'Deadline deleted' })
  } catch (error) {
    console.error('Deadline DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
