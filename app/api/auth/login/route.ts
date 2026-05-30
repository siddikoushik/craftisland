import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, encryptSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }

    const isValid = verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }

    // Create session token
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    const sessionToken = encryptSession({ id: user.id, email: user.email, expiresAt })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('vw_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (e) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'Something went wrong during login' }, { status: 500 })
  }
}
