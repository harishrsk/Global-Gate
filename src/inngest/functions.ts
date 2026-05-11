import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { AIService } from "@/services/ai.service";

/**
 * Enterprise Asynchronous Workflow: Multi-Image Grading & Compliance Synthesis
 * Handles long-running AI tasks with automatic retries and state management.
 */
export const processGrading = inngest.createFunction(
  { 
    id: "process-grading", 
    retries: 3,
    triggers: [{ event: "exim/docs.uploaded" }] 
  },
  async ({ event, step }) => {
    const { reportId, corridor, mimeType, imageBase64 } = event.data;
    console.log('>>> INNGEST FUNCTION TRIGGERED:', { reportId, eventName: event.name });

    // 1. Initial Processing Step (AI Vision Analysis)
    const gradingResult = await step.run("gemini-ai-analysis", async () => {
      console.log(`Starting AI Analysis for report ${reportId}`);
      
      if (!imageBase64) throw new Error("No image data provided for analysis");
      
      const buffer = Buffer.from(imageBase64, 'base64');
      
      const aiService = new AIService(process.env.GEMINI_API_KEY || "");
      
      try {
        const result = await aiService.gradeProduct(
          buffer,
          mimeType,
          `Trade Corridor: ${corridor}`
        );
        console.log(`AI Analysis completed for ${reportId}`);
        return result;
      } catch (err: any) {
        console.error(`AI Analysis FAILED for ${reportId}:`, err);
        throw err; // Trigger Inngest retry
      }
    });

    // 2. Synthesize Regulatory Requirements & Update DB
    await step.run("update-report-and-notify", async () => {
      console.log(`Updating DB for report ${reportId}...`);
      try {
        await prisma.report.update({
          where: { id: reportId },
          data: {
            content: gradingResult as any,
            status: "PENDING_HUMAN_REVIEW",
            imageUrl: event.data.imageUrl
          },
        });
        console.log(`DB updated for ${reportId}. HITL unlocked.`);

        // Log the async completion
        await prisma.auditLog.create({
          data: {
            action: "AI_ANALYSIS_COMPLETED",
            description: `Background AI analysis finished for ${corridor}. Awaiting manager review.`,
            userId: event.data.userId,
            reportId: reportId,
            payload: gradingResult as any,
          },
        });
      } catch (dbErr: any) {
        console.error(`DB Update FAILED for ${reportId}:`, dbErr);
        throw dbErr;
      }
    });

    return { success: true, reportId };
  }
);
