/**
 * The Memory module for the Agentic Architecture.
 * Handles lightweight behavioral tracking utilizing localStorage.
 * @module behaviorTracker
 */

const STORAGE_KEY = 'swasthbite_behavior_logs';

/**
 * Initializes the behavior tracking system mechanism.
 * Dynamically pre-loads 3 pieces of highly-structured mock historical data
 * if no data presently exists. This ensures adaptive learning is demonstratable.
 */
export function initBehaviorStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const mockData = [
      {
        timestamp: Date.now() - 86400000 * 3, // 3 days ago
        context: { goal: 'weight_loss', mood: 'stressed', hunger: 8 },
        decision: {
          suggestion: 'Eat Recommended',
          alternatives: ['Greens & Grains Salad', 'High-Protein Wrap'],
          score: 85
        }
      },
      {
        timestamp: Date.now() - 86400000 * 2, // 2 days ago
        context: { goal: 'weight_loss', mood: 'neutral', hunger: 4 },
        decision: {
          suggestion: 'Avoid/Delay',
          alternatives: ['Masala Oats', 'Fresh Fruit Bowl'],
          score: 35
        }
      },
      {
        timestamp: Date.now() - 86400000 * 1, // 1 day ago
        context: { goal: 'muscle_gain', mood: 'fatigued', hunger: 9 },
        decision: {
          suggestion: 'Eat Recommended',
          alternatives: ['Tandoori Chicken Bowl', 'Quinoa Stir-fry'],
          score: 92
        }
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
}

/**
 * Records a new reasoning decision to memory.
 * @param {Object} context - The structured user context state.
 * @param {Object} decision - The decision engine output block.
 */
export function logDecision(context, decision) {
  const history = getHistory();
  history.push({ timestamp: Date.now(), context, decision });
  // Prevent infinite storage bloat natively (Cap at 50 logs)
  if (history.length > 50) history.shift();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Retrieves the complete array of behavioral logs securely.
 * @returns {Array<Object>} Extracted history array.
 */
export function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

/**
 * Extracts the user's highest favored healthy alternative from storage
 * targeting their current primary goal to enable dynamic personalization loops.
 * @param {string} goal - The current core context goal string.
 * @returns {string|null} The most highly engaged alternative picked matching that context.
 */
export function getPastFavoredAlternative(goal) {
  const history = getHistory();
  if (history.length === 0) return null;

  const relevantLogs = history.filter(log => log.context.goal === goal && log.decision.score >= 70);
  if (relevantLogs.length === 0) return null;

  const frequencies = {};
  relevantLogs.forEach(log => {
    // Pick the first alternative as the primary proxy since it's the highest mapped recommendation
    const primaryAlt = log.decision.alternatives[0];
    if (primaryAlt) frequencies[primaryAlt] = (frequencies[primaryAlt] || 0) + 1;
  });

  let topAlt = null;
  let topCount = 0;
  for (const [alt, count] of Object.entries(frequencies)) {
    if (count > topCount) {
      topCount = count;
      topAlt = alt;
    }
  }
  return topAlt;
}

/**
 * Wipes the behavioral logs perfectly natively mapping back securely to clear user footprints.
 */
export function clearHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return true;
}
