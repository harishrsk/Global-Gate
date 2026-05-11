import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "global-gate-enterprise",
  schemas: {
    "exim/docs.uploaded": {
      data: {} as any // Simplified for runtime, types are for build-time
    }
  }
});

// Define event schemas for type safety
export type Events = {
  "exim/docs.uploaded": {
    data: {
      reportId: string;
      userId: string;
      corridor: string;
      mimeType: string;
      imageUrl: string;
      localPath?: string; 
    };
  };
};
