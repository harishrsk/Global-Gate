import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Grading Schema for Zod validation to prevent hallucinations
export const GradingResultSchema = z.object({
  quality_score: z.number().min(0).max(100),
  grading_class: z.enum(['PREMIUM', 'STANDARD', 'SUBSTANDARD', 'REJECTED']),
  defects: z.array(z.string()),
  compliance_status: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'WARNING']),
  required_paperwork: z.array(z.object({
    document: z.string(),
    description: z.string(),
    mandatory: z.boolean(),
  })),
  market_intelligence: z.object({
    high_demand_countries: z.array(z.string()),
    top_producers: z.array(z.string()),
    price_trend: z.string(),
  }),
  analysis_summary: z.string(),
  suggested_action: z.string(),
});

export type GradingResult = z.infer<typeof GradingResultSchema>;

/**
 * Compliance Data Adapter Interface
 */
export interface ComplianceAdapter {
  getRegulations(interest: string): Promise<string[]>;
}

/**
 * Gemini RAG Adapter (Initial implementation)
 */
export class GeminiRAGAdapter implements ComplianceAdapter {
  async getRegulations(interest: string): Promise<string[]> {
    // In a real RAG flow, this would query a vector DB or Gemini's uploaded files
    return [`General agricultural export standards for ${interest}`];
  }
}

/**
 * AI Service (Modular Gemini Integration)
 */
export class AIService {
  private genAI: GoogleGenerativeAI;
  private complianceAdapter: ComplianceAdapter;

  constructor(apiKey: string, adapter: ComplianceAdapter = new GeminiRAGAdapter()) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.complianceAdapter = adapter;
  }

  /**
   * Multimodal Grading Pipeline
   * Analyzes an image using Gemini 1.5 Flash.
   */
  async gradeProduct(imageBuffer: Buffer, mimeType: string, context: string): Promise<GradingResult> {
    const model = this.genAI.getGenerativeModel(
      { model: 'gemini-flash-latest' }
    );

    const prompt = `
      Analyze the provided product image for quality, authenticity, and trade compliance.
      Context: ${context}
      
      Instructions:
      1. Identify the product category (Agriculture, Electronics, Textiles, etc.).
      2. Grade based on industry standards for that specific category.
      3. Identify required documentation (Import/Export licenses, Safety certificates, etc.).
      4. Provide market intelligence trends for this specific sector.
      
      Return the results in strict JSON format matching this schema:
      {
        "quality_score": number (0-100),
        "grading_class": "PREMIUM" | "STANDARD" | "SUBSTANDARD" | "REJECTED",
        "defects": string[],
        "compliance_status": "COMPLIANT" | "NON_COMPLIANT" | "WARNING",
        "required_paperwork": [
          { "document": "string", "description": "string", "mandatory": boolean }
        ],
        "market_intelligence": {
          "high_demand_countries": string[],
          "top_producers": string[],
          "price_trend": "string (e.g. rising/stable)"
        },
        "analysis_summary": "string",
        "suggested_action": "string"
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('AI failed to return valid JSON grading results.');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return GradingResultSchema.parse(parsed);
  }

  /**
   * General JSON Generation Utility
   */
  async generateJSON(prompt: string, modelName: string = 'gemini-flash-latest'): Promise<any> {
    const model = this.genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt + " \n IMPORTANT: Return ONLY raw JSON. No markdown backticks.");
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('AI failed to return valid JSON');
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Fetches personalized compliance feed based on user interests.
   */
  async getPersonalizedCompliance(interests: string[]): Promise<any> {
    const allRegulations = await Promise.all(
      interests.map(i => this.complianceAdapter.getRegulations(i))
    );
    return allRegulations.flat();
  }
}
