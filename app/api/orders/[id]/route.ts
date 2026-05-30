import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { mapDbOrder } from '../route'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Update order status (Processing -> Shipped -> Delivered)
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ order: mapDbOrder(updated) })
  } catch (e) {
    console.error('Update order error:', e)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
