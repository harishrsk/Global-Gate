import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { processGrading } from "@/inngest/functions";

// Export the Inngest serve handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processGrading,
  ],
});
