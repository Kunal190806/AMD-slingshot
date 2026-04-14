/**
 * The Simulated ML Brain component representing the interpretable nutrition logic.
 * @module nutritionReasoner
 */

/**
 * Analyzes contexts to calculate a quantifiable health decision payload prioritizing AI Explainability scoring constraints.
 * @param {Object} context - Real-time situational context block from out Observer module.
 * @param {string|null} historyFavored - The personalized algorithmic affinity match if one exists.
 * @returns {Object} Evaluated outcome encapsulating { score, decision, explanation, alternatives }.
 */
export function calculateHealthScore(context, historyFavored) {
  let score = 50; 
  let explanation = '';

  // 1: Synthesize logic based on hunger constraints weighting
  if (context.hunger > 7) {
    if (context.mood === 'stressed' || context.mood === 'fatigued') {
       score -= 25;
       explanation = "High fatigue combined with deep hunger drastically increases impulsive metabolic cravings.";
    } else {
       score += 15;
       explanation = "Active hunger levels indicate optimized digestive timing for nutrient absorption naturally.";
    }
  } else if (context.hunger < 4) {
    score -= 15;
    explanation = "Your system is not presently seeking caloric fuel; grazing behavior detected natively.";
  } else {
    score += 20;
    explanation = "Moderate appetite stability detected, indicating a disciplined metabolic state ideal for sustained energy input.";
  }

  // 2: Apply temporal logic modifiers
  if (context.timeOfDay === 'night' && context.hunger < 6) {
    score -= 20;
    explanation += " Consuming dense nutrients late at night strictly disrupts natural circadian metabolic recovery cycles.";
  }

  // Finalize bounds
  score = Math.max(0, Math.min(100, score));

  // Determine Categorical Output Decision constraints
  const decisionStr = score >= 65 ? 'Eat Recommended' : 'Avoid/Delay';

  // Array derivation targeting dietary constraints
  let alternatives = [];
  if (context.goal === 'weight_loss') {
    alternatives = ['Sprouted Moong Salad', 'Tandoori Paneer Grill'];
  } else if (context.goal === 'muscle_gain') {
    alternatives = ['Soya Chunks Stir-fry', 'Tandoori Chicken Skewers'];
  } else {
    alternatives = ['Masala Oats Bowl', 'Dahi (Yogurt) with Nuts'];
  }

  // Inject History Bias to demonstrate adaptive agentic learning visually
  if (historyFavored && !alternatives.includes(historyFavored)) {
    alternatives[0] = `(Personalized) ${historyFavored}`;
  }

  return {
    score: score,
    decision: decisionStr,
    explanation: explanation.trim(),
    alternatives: alternatives
  };
}
