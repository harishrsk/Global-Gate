'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function getDashboardStats() {
  const session = await getSession();
  if (!session) return { corridors: 0, reports: 0, pending: 0 };

  const [corridors, reports, pending] = await Promise.all([
    prisma.tradeCorridor.count({ where: { userId: session.user.id } }),
    prisma.report.count({ where: { authorId: session.user.id } }),
    prisma.report.count({ where: { status: 'PENDING_HUMAN_REVIEW' } }),
  ]);

  return { corridors, reports, pending };
}

export async function getPendingReports() {
  const session = await getSession();
  if (!session) return [];

  const reports = await prisma.report.findMany({
    where: { 
      status: 'PENDING_HUMAN_REVIEW'
    },
    include: {
      author: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return reports.map(r => ({
    id: r.id,
    title: r.title,
    status: r.status,
    content: r.content as any,
    imageUrl: r.imageUrl || '',
    securityLevel: r.securityLevel || 'STANDARD',
    author: r.author
  }));
}
