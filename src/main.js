/**
 * Main Application Orchestrator script.
 * Handles system wiring exclusively linking logic arrays (the brain) tightly towards the UI (presentation).
 */
import { initBehaviorStorage, getPastFavoredAlternative, logDecision } from './behaviorTracker.js';
import { gatherContext } from './contextObserver.js';
import { calculateHealthScore } from './nutritionReasoner.js';
import { fetchHealthyPlaces } from './actionMapper.js';
import { updateResponseUI, renderPlacesGrid } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Preload structured mock ML history
  initBehaviorStorage();

  const form = document.getElementById('context-form');
  const placesContainer = document.getElementById('places-container');
  const hungerLevel = document.getElementById('hunger-level');
  const hungerDisplay = document.getElementById('hunger-value-display');

  // Input listener natively tracking
  hungerLevel.addEventListener('input', (e) => {
    hungerDisplay.textContent = e.target.value;
    hungerLevel.setAttribute('aria-valuenow', e.target.value);
  });

  const orchestrateInference = async () => {
    // 1. Observe Variables Contextually
    const currentContext = gatherContext();
    
    // 2. Fetch Algorithmic Memories explicitly matching target goal natively
    const favoredAlt = getPastFavoredAlternative(currentContext.goal);

    // 3. Inference Engine Computation cleanly extracting interpreted JSON markers
    const inferenceNode = calculateHealthScore(currentContext, favoredAlt);

    // 4. Log Decisions natively building personalized loop
    logDecision(currentContext, inferenceNode);

    // 5. Update Structural DOM Elements actively utilizing pure functions securely
    updateResponseUI(inferenceNode);

    // 6. Asynchronous Map Fetch resolving output natively
    placesContainer.innerHTML = '<p style="color: var(--on-surface-variant); font-size: 0.875rem;">Searching for nearby healthy options...</p>';
    const retrievedPlaces = await fetchHealthyPlaces(currentContext.location, inferenceNode);
    renderPlacesGrid(retrievedPlaces, placesContainer);
  };

  // Attach submit listeners securely omitting page disruptions
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await orchestrateInference();
  });
  
  // Clean pipeline firing safely instantly upon module loading bounds locally
  orchestrateInference();
});
