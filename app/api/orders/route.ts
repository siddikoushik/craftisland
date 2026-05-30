import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// Helper function to map dynamic database order records to the exact frontend schemas expected
export function mapDbOrder(o: any) {
  let parsedItems = []
  try {
    parsedItems = o.items ? JSON.parse(o.items) : []
  } catch (e) {
    console.error('Failed to parse items for order:', o.id, e)
  }

  // Format dynamic items list to match the checkout/admin page expected lists
  const itemsText = parsedItems
    .map((item: any) => `${item.name} (${item.variant || 'Classic'})`)
    .join(', ')

  return {
    id: o.id,
    customer: o.customerName,
    email: o.customerEmail || '',
    items: itemsText,
    itemsList: parsedItems,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentDetails: o.paymentDetails || '',
    date: o.date,
  }
}

// Fetch user orders or all orders for Admin panel
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    
    const user = await getSessionUser()
    
    let dbOrders
    if (all) {
      dbOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
      })
    } else if (user) {
      dbOrders = await prisma.order.findMany({
        where: {
          OR: [
            { userId: user.id },
            { customerEmail: user.email }
          ]
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // Fallback to empty if not logged in and not request all
      dbOrders = []
    }

    const orders = dbOrders.map(mapDbOrder)
    return NextResponse.json({ orders })
  } catch (e) {
    console.error('Fetch orders error:', e)
    return NextResponse.json({ error: 'Failed to retrieve orders' }, { status: 500 })
  }
}

// Submit a new order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerName, customerEmail, items, total,
      paymentMethod, paymentDetails, date
    } = body

    if (!customerName || !items || total === undefined || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 })
    }

    const user = await getSessionUser()
    const formattedDate = date || new Date().toISOString().split('T')[0]
    
    // Generate order ID (ORD-XXXX)
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const orderId = `ORD-${randomNum}`

    const created = await prisma.order.create({
      data: {
        id: orderId,
        customerName,
        customerEmail: customerEmail || user?.email || null,
        items: JSON.stringify(items),
        total: parseFloat(total),
        status: 'Processing',
        paymentMethod,
        paymentDetails: paymentDetails || null,
        date: formattedDate,
        userId: user?.id || null,
      }
    })

    return NextResponse.json({ order: mapDbOrder(created) })
  } catch (e) {
    console.error('Submit order error:', e)
    return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 })
  }
}
