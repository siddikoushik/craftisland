import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, encryptSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, address } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 })
    }

    const hashedPassword = hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
      }
    })

    // Create session token (expires in 7 days)
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
    const sessionToken = encryptSession({ id: user.id, email: user.email, expiresAt })

    // Set HTTP-only secure cookie
    const cookieStore = await cookies()
    cookieStore.set('vw_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Return safe user profile (without password hash)
    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (e) {
    console.error('Registration error:', e)
    return NextResponse.json({ error: 'Something went wrong during registration' }, { status: 500 })
  }
}
