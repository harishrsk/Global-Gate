'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const content = formData.get('content') as string;
  const category = formData.get('category') as string;

  if (!content) return { success: false, error: 'Feedback content is required' };

  try {
    await prisma.feedback.create({
      data: {
        content,
        category,
        userId: session.user.id
      }
    });

    revalidatePath('/dashboard/feedback');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getFeedbacks() {
  return await prisma.feedback.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
}
