/**
 * Behavior Tracker: Minimalist storage and pattern simulation using localStorage.
 */

const STORAGE_KEY = 'swasthbite_behavior_history';

/**
 * Initializes the history with provided mock data if it doesn't exist.
 */
export function initBehaviorStorage() {
  const existingHistory = localStorage.getItem(STORAGE_KEY);
  
  if (!existingHistory) {
    const mockData = [
      {
        timestamp: Date.now() - 86400000 * 2, // 2 days ago
        context: { goal: 'weight_loss', mood: 'stressed', hunger: 8 },
        decision: {
          suggestion: 'Eat',
          healthyAlternative: 'Salads',
          score: 85
        }
      },
      {
        timestamp: Date.now() - 86400000 * 1, // 1 day ago
        context: { goal: 'weight_loss', mood: 'neutral', hunger: 4 },
        decision: {
          suggestion: 'Avoid',
          healthyAlternative: 'Fruit Bowl',
          score: 35
        }
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
}

/**
 * Persists the latest decision into localized history.
 * @param {Object} context 
 * @param {Object} decision 
 */
export function logDecision(context, decision) {
  const history = getHistory();
  history.push({
    timestamp: Date.now(),
    context,
    decision
  });
  
  // Keep only the latest 50 entries to maintain ultra-low storage usage
  if (history.length > 50) history.shift();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Fetches recent behavior history.
 * @returns {Array} Array of historical decisions.
 */
export function getHistory() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Simulates analyzing past behavior to find a favored healthy alternative.
 * @param {string} goal 
 * @returns {string|null} The most repeatedly suggested high-score food for this goal.
 */
export function getPastFavoredAlternative(goal) {
  const history = getHistory();
  const successfulRelevantDecisions = history.filter(
    item => item.context.goal === goal && item.decision.score >= 70
  );
  
  if (successfulRelevantDecisions.length === 0) return null;
  
  // Return the most recent successful alternative
  return successfulRelevantDecisions[successfulRelevantDecisions.length - 1].decision.healthyAlternative;
}
