'use server';

import { prisma } from '@/lib/prisma';
import { login, logout } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name is required').optional(),
});

export async function signupAction(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = AuthSchema.parse(rawData);

    // 1. Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return { success: false, error: 'User already exists' };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        name: validated.name || '',
      },
    });

    // 4. Create session
    await login({ id: user.id, email: user.email, role: user.role });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Signup failed. Please try again.' };
  }

  redirect('/dashboard');
}

export async function loginAction(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string(),
    }).parse(rawData);

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // 2. Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // 3. Create session
    await login({ id: user.id, email: user.email, role: user.role });

  } catch (error: any) {
    return { success: false, error: 'Login failed. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  await logout();
  redirect('/login');
}
