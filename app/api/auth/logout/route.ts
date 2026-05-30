import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('vw_session')
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Logout error:', e)
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 })
  }
}
