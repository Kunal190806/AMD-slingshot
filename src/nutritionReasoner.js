/**
 * Nutrition Reasoner: The core logic mimicking an AI/ML decision tree.
 * Calculates an interpretable "Health Score".
 */

/**
 * Calculates health recommendations based on context points
 * @param {Object} context - The user context (goal, hunger, mood, timeOfDay).
 * @param {string|null} pastFavored - Data from behaviorTracker.
 * @returns {Object} { score, suggestion, alternatives, explanation }
 */
export function evaluateNutrition(context, pastFavored = null) {
  // Validate inputs, fallback gracefully
  if (!context || typeof context.hunger !== 'number') {
    return createFallback();
  }

  let rawScore = 50; // Neutral baseline
  const explanations = [];

  // Goal Weights
  if (context.goal === 'weight_loss') {
    rawScore += 10;
    explanations.push("Weight loss goal selected: Prioritizing high-volume, low-calorie nutrient density.");
  } else if (context.goal === 'muscle_gain') {
    rawScore += 5;
    explanations.push("Muscle gain objective: Increasing required protein margins.");
  }

  // Hunger Weights
  if (context.hunger > 7) {
    rawScore -= 5;
    explanations.push(`High hunger (Level ${context.hunger}): You are prone to impulsive eating; recommending heavy fiber to stabilize blood sugar.`);
  } else if (context.hunger < 4) {
    rawScore -= 10;
    explanations.push(`Low hunger (Level ${context.hunger}): Potential emotional eating detected. Consider delaying the meal.`);
  } else {
    rawScore += 10;
    explanations.push(`Moderate hunger (Level ${context.hunger}): Optimal metabolic window for a balanced meal.`);
  }

  // Mood Weights
  if (context.mood === 'stressed' || context.mood === 'fatigued') {
    rawScore -= 15;
    explanations.push(`Mood is ${context.mood}: Cortisol elevated. High risk of craving refined sugars. Recommending omega-3s and complex carbs.`);
  } else if (context.mood === 'happy') {
    rawScore += 10;
    explanations.push("Positive mood detected: Better self-control. Good state for mindful eating.");
  }

  // Time of Day
  if (context.timeOfDay === 'night') {
    rawScore -= 10;
    explanations.push("Night time: Digestion slows. Heavy calorie intake score severely reduced.");
  }

  // Ensure bounds
  const finalScore = Math.max(0, Math.min(100, rawScore));

  // Determine Categorization
  let suggestion = 'Caution';
  if (finalScore >= 70) suggestion = 'Eat';
  else if (finalScore < 40) suggestion = 'Avoid';

  // Determine Alternatives
  let alternatives = [];
  if (context.goal === 'weight_loss') alternatives = ['Sprouted Moong Salad', 'Tandoori Paneer', 'Palak Soup'];
  else if (context.goal === 'muscle_gain') alternatives = ['Soya Chunks Curry', 'Tandoori Chicken', 'High-Protein Sattu'];
  else alternatives = ['Masala Oats', 'Dahi / Curd', 'Makhana (Fox Nuts)'];

  // Inject behavioral tracking data
  if (pastFavored && !alternatives.includes(pastFavored)) {
    alternatives.unshift(pastFavored + ' (Past Favorite)');
    explanations.push(`Historical data reveals you succeed often with: ${pastFavored}.`);
  }

  return {
    score: finalScore,
    suggestion: suggestion,
    alternatives: alternatives.slice(0, 3),
    explanation: explanations.join(' ')
  };
}

function createFallback() {
  return {
    score: 50,
    suggestion: 'Caution',
    alternatives: ['Water', 'Apples'],
    explanation: "Insufficient sensory data. Recommending baseline hydration and fiber."
  };
}
