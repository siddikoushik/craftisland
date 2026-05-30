import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Fetch the active session user
export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ user: null })
    }
    return NextResponse.json({ user })
  } catch (e) {
    console.error('Fetch session error:', e)
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 })
  }
}

// Update the active session user's profile details
export async function PUT(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone, address, scentPreference, selectedMood } = await request.json()

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : null,
        address: address !== undefined ? address : null,
        scentPreference: scentPreference !== undefined ? scentPreference : undefined,
        selectedMood: selectedMood !== undefined ? selectedMood : undefined,
      }
    })

    const { password: _, ...safeUser } = updated
    return NextResponse.json({ user: safeUser })
  } catch (e) {
    console.error('Update session user error:', e)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
