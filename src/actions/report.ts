'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function getReportStatus(reportId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      status: true,
      content: true,
      title: true,
    }
  });

  return report;
}
