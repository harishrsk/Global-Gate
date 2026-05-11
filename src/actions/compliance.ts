'use server';

import { AIService } from '@/services/ai.service';
import { getCorridors } from './corridor';

export async function getComplianceFeed() {
  const corridors = await getCorridors();
  if (corridors.length === 0) return [];

  const aiService = new AIService(process.env.GEMINI_API_KEY || "");
  
  const prompt = `
    Based on these actual trade corridors: ${corridors.map(c => c.name).join(', ')}.
    Generate a list of 3-4 realistic regulatory compliance alerts or updates.
    Return as a JSON array of objects with:
    - title (e.g., "Pesticide Limit Update")
    - corridor (one of the corridors from the list)
    - severity ("HIGH", "MEDIUM", or "LOW")
    - description (a short detailed summary)
    - date (e.g., "2 hours ago" or "Yesterday")
  `;

  try {
    const result = await aiService.generateJSON(prompt);
    return result as any[];
  } catch (error) {
    console.error('Compliance Feed AI synthesis failed:', error);
    // Fallback to a single generic alert if AI fails
    return [{
      title: "Global Standards Update",
      corridor: corridors[0].name,
      severity: "LOW",
      description: "Standard review of ISO agricultural standards in progress.",
      date: "Just now"
    }];
  }
}
