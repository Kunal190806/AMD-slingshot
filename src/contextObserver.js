/**
 * The Senses module handling real-time extraction of user intent and status safely.
 * @module contextObserver
 */

/**
 * Probes the Application UI deeply to aggregate sensory input efficiently.
 * Includes explicit edge-case and silent failure handling routing defaulting safely.
 * @returns {Object} Structured context block (goal, hunger, mood, location, timeOfDay).
 */
export function gatherContext() {
  const goalSelect = document.getElementById('goal-select');
  const hungerLevel = document.getElementById('hunger-level');
  const moodSelect = document.getElementById('mood-select');
  const locationInput = document.getElementById('location-input');

  const now = new Date();
  const currentHour = now.getHours();

  return {
    goal: goalSelect?.value || 'maintenance',
    hunger: parseInt(hungerLevel?.value || "5", 10),
    mood: moodSelect?.value || 'neutral',
    location: locationInput?.value || 'Mumbai, India',
    timeOfDay: currentHour >= 5 && currentHour < 11 ? 'morning' :
               currentHour >= 11 && currentHour < 15 ? 'afternoon' :
               currentHour >= 15 && currentHour < 22 ? 'evening' : 'night'
  };
}
