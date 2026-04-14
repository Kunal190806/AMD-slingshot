/**
 * Context Observer: Responsible for securely gathering real-time context
 * such as goal, hunger level, mood, and potentially location or time.
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
    location: locationInput?.value || '',
    timeOfDay: currentHour >= 5 && currentHour < 11 ? 'morning' :
               currentHour >= 11 && currentHour < 15 ? 'afternoon' :
               currentHour >= 15 && currentHour < 22 ? 'evening' : 'night'
  };
}
