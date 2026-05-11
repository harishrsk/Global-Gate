'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CorridorSchema = z.object({
  product: z.string().min(1, 'Product name is required'),
  origin: z.string().min(1, 'Origin country is required'),
  destination: z.string().min(1, 'Destination country is required'),
  type: z.enum(['IMPORT', 'EXPORT']),
  category: z.enum(['AGRICULTURE', 'ELECTRONICS', 'TEXTILES', 'PHARMACEUTICALS', 'AUTOMOTIVE', 'CHEMICALS', 'OTHER']),
});

export async function getCorridors() {
  const session = await getSession();
  if (!session) return [];

  return await prisma.tradeCorridor.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCorridor(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    const rawData = {
      product: formData.get('product'),
      origin: formData.get('origin'),
      destination: formData.get('destination'),
      type: formData.get('type'),
      category: formData.get('category'),
    };

    const validated = CorridorSchema.parse(rawData);

    await prisma.tradeCorridor.create({
      data: {
        ...validated,
        name: `${validated.product} (${validated.origin} -> ${validated.destination})`,
        userId: session.user.id,
      },
    });

    revalidatePath('/dashboard/corridors');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteCorridor(id: string) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.tradeCorridor.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath('/dashboard/corridors');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
 
