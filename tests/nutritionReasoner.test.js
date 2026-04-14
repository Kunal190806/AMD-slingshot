import { describe, it, expect } from 'vitest';
import { evaluateNutrition } from '../src/nutritionReasoner.js';

describe('nutritionReasoner logic', () => {

  it('should return a high score and Eat suggestion for optimal context', () => {
    const context = {
      goal: 'weight_loss',
      hunger: 5,
      mood: 'happy',
      timeOfDay: 'afternoon'
    };
    const result = evaluateNutrition(context);
    expect(result.score).toBeGreaterThan(69); // At least 70
    expect(result.suggestion).toBe('Eat');
  });

  it('should penalize for night time and stress (Avoid)', () => {
    const context = {
      goal: 'maintenance',
      hunger: 9, // +10 or -5 based on logic? 9 is >7 so -5.
      mood: 'stressed', // -15
      timeOfDay: 'night' // -10
    };
    // Baseline 50 - 5 - 15 - 10 = 20
    const result = evaluateNutrition(context);
    expect(result.score).toBeLessThan(40);
    expect(result.suggestion).toBe('Avoid');
  });

  it('should include past favored alternative if provided', () => {
    const context = {
      goal: 'muscle_gain',
      hunger: 6,
      mood: 'neutral',
      timeOfDay: 'morning'
    };
    const result = evaluateNutrition(context, 'Grilled Chicken');
    expect(result.alternatives[0]).toBe('Grilled Chicken (Past Favorite)');
  });

  it('should handle invalid or missing state gracefully (Fallback)', () => {
    const result = evaluateNutrition(null);
    expect(result.score).toBe(50);
    expect(result.suggestion).toBe('Caution');
    expect(result.explanation).toContain('Insufficient sensory data');
  });

  it('should enforce health score bounds (0-100)', () => {
    // Force a very low score
    const negativeContext = { goal: 'maintenance', hunger: 2, mood: 'stressed', timeOfDay: 'night' };
    const result = evaluateNutrition(negativeContext);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
