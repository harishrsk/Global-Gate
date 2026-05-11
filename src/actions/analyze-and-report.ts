'use server';

import { prisma } from '@/lib/prisma';
import { AIService, GeminiRAGAdapter } from '@/services/ai.service';
import { PQCService } from '@/services/pqc.service';
import { z } from 'zod';
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

import { getSession } from '@/lib/auth';
import { inngest } from '@/lib/inngest';

const AnalyzeSchema = z.object({
  corridor: z.string(),
  image: z.instanceof(Blob),
  mimeType: z.string(),
});

/**
 * Primary "Vision-to-Verification" Server Action
 */
export async function analyzeAndReport(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return { success: false, error: { title: 'Unauthorized', status: 401, detail: 'You must be logged in to analyze products.' } };
    }

    const userId = session.user.id;
    const rawData = {
      corridor: formData.get('corridor'),
      image: formData.get('image'),
      mimeType: formData.get('mimeType') || 'image/jpeg',
    };

    const validated = AnalyzeSchema.parse(rawData);
    
    // 1. Create Initial Report (PROCESSING status)
    const report = await prisma.report.create({
      data: {
        title: `Quality Grading: ${validated.corridor} - ${new Date().toLocaleDateString()}`,
        content: {}, // Placeholder
        status: 'PROCESSING',
        authorId: userId,
        imageUrl: 'placeholder-signed-url',
      },
    });

    // 2. Convert Image to Base64 for Cloud processing
    const arrayBuffer = await validated.image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // 3. Trigger Asynchronous Workflow (Pass Base64 data directly)
    console.log('Triggering Inngest event with Cloud-Ready data...');
    try {
      await inngest.send({
        name: "exim/docs.uploaded",
        data: {
          reportId: report.id,
          userId: userId,
          corridor: validated.corridor,
          mimeType: validated.mimeType,
          imageBase64: base64Image, // Cloud-Ready transfer
        },
      });
      console.log('Inngest event sent successfully');
    } catch (inngestError: any) {
      console.error('Inngest Send Failed:', inngestError);
      throw new Error(`Workflow engine unavailable: ${inngestError.message}`);
    }

    logger.info({ reportId: report.id }, 'Async AI Analysis Triggered');

    return {
      success: true,
      reportId: report.id,
      status: 'PROCESSING'
    };

  } catch (error: any) {
    logger.error(error, 'Vision-to-Verification Pipeline Failed');
    
    // Standardized RFC 7807 problem details (simplified)
    return {
      success: false,
      error: {
        title: 'Analysis Error',
        status: 500,
        detail: error.message || 'An unexpected error occurred during AI analysis.',
      },
    };
  }
}

/**
 * Verification Approval Action
 * Includes PQC Signing logic.
 */
export async function approveReport(reportId: string, managerId: string) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) throw new Error('Report not found');

    // 1. Generate PQC Signature
    const signatureResult = await PQCService.signReport(reportId, report.content);

    // 2. Update Report
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'APPROVED',
        approverId: managerId,
        pqcSignature: signatureResult.signature,
        securityLevel: signatureResult.securityLevel,
      },
    });

    // 3. Log Audit Trail
    await prisma.auditLog.create({
      data: {
        action: 'HUMAN_APPROVAL',
        description: `Manager ${managerId} approved report ${reportId} with PQC signature`,
        userId: managerId,
        reportId: reportId,
        payload: { signatureResult } as any,
      },
    });

    return { success: true, report: updatedReport };

  } catch (error: any) {
    logger.error(error, 'Approval Process Failed');
    return { success: false, error: error.message };
  }
}
