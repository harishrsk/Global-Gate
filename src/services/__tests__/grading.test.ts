import { describe, it, expect, vi } from 'vitest';
import { GradingResultSchema } from '@/services/ai.service';

describe('Grading Logic Validation', () => {
  it('should validate correct grading results from AI', () => {
    const mockResult = {
      quality_score: 85,
      grading_class: 'PREMIUM',
      defects: [],
      compliance_status: 'COMPLIANT',
      analysis_summary: 'Excellent quality capsicum.',
      suggested_action: 'Proceed to export.',
    };

    const validated = GradingResultSchema.parse(mockResult);
    expect(validated.quality_score).toBe(85);
    expect(validated.grading_class).toBe('PREMIUM');
  });

  it('should fail on invalid grading data', () => {
    const invalidResult = {
      quality_score: 'A+', // Should be a number
      grading_class: 'ELITE', // Not in enum
    };

    expect(() => GradingResultSchema.parse(invalidResult)).toThrow();
  });
});
