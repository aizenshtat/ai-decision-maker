// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { validateInput, required, minLength, isEmail } from '@/utils/validation'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Server-side validation
    const errors: { [key: string]: string[] } = {
      username: validateInput(username, [required, isEmail]),
      password: validateInput(password, [required, minLength(8)]),
    }

    if (Object.values(errors).some(fieldErrors => fieldErrors.length > 0)) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: username },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: username,
        password: hashedPassword,
      },
    })

    console.log('User created:', user.id);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 })
  }
}