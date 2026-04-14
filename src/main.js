/**
 * Main application wiring tying context, reasoning, history, and UI.
 */
import { gatherContext } from './contextObserver.js';
import { evaluateNutrition } from './nutritionReasoner.js';
import { initBehaviorStorage, logDecision, getPastFavoredAlternative, getHistory, clearHistory } from './behaviorTracker.js';
import { fetchHealthyPlaces } from './actionMapper.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize mock ML tracking
  initBehaviorStorage();

  const hungerLevel = document.getElementById('hunger-level');
  const hungerDisplay = document.getElementById('hunger-value-display');
  const form = document.getElementById('context-form');
  const responseContainer = document.getElementById('ai-response-container');
  const placesContainer = document.getElementById('places-container');

  // Sync range slider display
  hungerLevel.addEventListener('input', (e) => {
    hungerDisplay.textContent = e.target.value;
    hungerLevel.setAttribute('aria-valuenow', e.target.value);
  });

  const runEvaluation = async () => {
    // 1. Observe Context
    const currentContext = gatherContext();
    
    // 2. Query History
    const pastFavored = getPastFavoredAlternative(currentContext.goal);

    // 3. Evaluate Logic Engine
    const decision = evaluateNutrition(currentContext, pastFavored);

    // 4. Log Decision for Future Learning
    logDecision(currentContext, decision);

    // 5. Render Output
    renderResponse(decision, responseContainer);

    // 6. Action Mapping (Async Fetch) using location
    placesContainer.innerHTML = '<p style="color: var(--on-surface-variant); font-size: 0.875rem;">Searching for nearby healthy options...</p>';
    const places = await fetchHealthyPlaces(decision.alternatives[0], currentContext.location);
    renderPlaces(places, placesContainer);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await runEvaluation();
  });
  
  // Clean initialization rendering dynamically
  runEvaluation();

  /* --- SPA ROUTING LOGIC --- */
  const navLinks = document.querySelectorAll('.nav-link');
  const pageViews = document.querySelectorAll('.page-view');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;

      // Update active states on links
      navLinks.forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll(`[data-target="${targetId}"]`).forEach(n => n.classList.add('active'));

      // Switch view displays
      pageViews.forEach(view => {
        if (view.id === targetId) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      // Load specific data per view
      if (targetId === 'view-logs') populateLogs();
      if (targetId === 'view-insights') populateInsights();
      if (targetId === 'view-nearby') populateNearby();
    });
  });

  // Account: Clear Data Handler
  document.getElementById('clear-history-btn').addEventListener('click', () => {
    clearHistory();
    alert('Behavioral learning caches wiped natively!');
  });
});

/** SPA VIEW POPULATORS **/

function populateLogs() {
  const container = document.getElementById('logs-list-container');
  const history = getHistory().reverse(); // newest first
  if (history.length === 0) {
    container.innerHTML = '<p class="text-muted">No historical data recorded yet.</p>';
    return;
  }
  let html = '';
  history.forEach((log) => {
     let dateObj = new Date(log.timestamp);
     let dString = isNaN(dateObj) ? 'Past Entry' : dateObj.toLocaleString();
     html += `
       <div class="glass-card">
         <h4 style="margin-bottom:0.5rem;">${dString}</h4>
         <p><strong>Goal:</strong> ${log.context.goal} | <strong>Mood:</strong> ${log.context.mood}</p>
         <p><strong>Decision Engine:</strong> ${log.decision.suggestion} (Score: ${log.decision.score})</p>
         <p><strong>Alternative Picked:</strong> <span class="tag" style="background:var(--tertiary); color:white; padding:2px 6px; border-radius:4px;">${log.decision.healthyAlternative}</span></p>
       </div>
     `;
  });
  container.innerHTML = html;
}

function populateInsights() {
  const container = document.getElementById('insight-text-output');
  const favored = getPastFavoredAlternative(document.getElementById('goal-select').value || 'maintenance');
  container.textContent = favored ? `Based on your recent paths, the algorithm has identified an affinity for "${favored}". We will prioritize this matching locally.` : "Insufficient behavioral data to identify a strict macro preference for your current goal yet.";
}

async function populateNearby() {
  const container = document.getElementById('nearby-page-container');
  container.innerHTML = '<p class="text-muted" style="grid-column: span 12;">Fetching locations locally...</p>';
  // Provide a generic top search term to fill the page grid
  const places = await fetchHealthyPlaces('Fresh Food', document.getElementById('location-input').value);
  // Extend array to simulate more items for a full page grid visually
  const fullPlaces = [...places, ...places, ...places]; // 9 mock items
  renderPlaces(fullPlaces, container);
}

/** Original Shared Rendering Block below... **/

/**
 * Renders the AI decision onto the UI utilizing templates and CSS status classes.
 */
function renderResponse(decision, container) {
  let isPositive = decision.score >= 70;
  let pillClass = decision.suggestion === 'Eat' ? 'eat-recommended' : 'avoid';
  let pillIcon = decision.suggestion === 'Eat' ? 'check_circle' : 'warning';
  
  // Calculate SVG Circle Dash Offset (440 is the circumference)
  let offset = 440 * (1 - (decision.score / 100));

  container.innerHTML = `
    <div class="score-circle">
      <svg viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" class="track"></circle>
        <circle cx="80" cy="80" r="70" class="progress" style="stroke-dashoffset: ${offset};"></circle>
      </svg>
      <div class="score-data">
        <span class="value">${decision.score}</span>
        <span class="label">Health Score</span>
      </div>
    </div>
    
    <div class="status-pill ${pillClass}">
      <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">${pillIcon}</span> ${decision.suggestion.toUpperCase()}
    </div>
    
    <div class="insight-text">
      <h3>Precision Insight</h3>
      <p>${decision.explanation}</p>
    </div>
  `;

  // Update alternatives
  const altContainer = document.getElementById('alternatives-container');
  if (altContainer) {
    let listHtml = '';
    decision.alternatives.forEach(alt => {
      // Pick a random icon for demo variations
      const icon = alt.includes('Moong') || alt.includes('Sattu') ? 'eco' : alt.includes('Dahi') || alt.includes('Soup') ? 'water_full' : 'restaurant';
      listHtml += `
        <div class="alt-item">
          <div class="alt-info">
            <div class="icon-box"><span class="material-symbols-outlined">${icon}</span></div>
            <div>
              <p>${alt}</p>
              <span>Algorithmic Alternative</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-tertiary">trending_up</span>
        </div>
      `;
    });
    
    altContainer.innerHTML = `
      <h4>Healthier Alternatives</h4>
      <div class="list">
        ${listHtml}
      </div>
    `;
  }
}

/**
 * Renders mapped places into Clinical Ether cards.
 */
function renderPlaces(places, container) {
  if (places.length === 0) {
    container.innerHTML = '<p class="text-muted" style="grid-column: span 12;">No nearby places found via Action Mapper.</p>';
    return;
  }

  let html = '';
  // Provide some thematic mock images if undefined
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD-3UJ1qjwVVl46iLATykaByNrsrDCzMTt4H1BsngJfIcYsVgOpiAMhOPJKrupM5LlkO8mWYTYIG12-JlzDfIuIi6uUNOX8IuXNt36j_mutDSBc8JZ7G9kLI-2ndA42YkNdLu65t7dPHJ1NUth8MC5-3qmGZXKooBEGHzea4QURwyIvTqOxqXqeG7bRhXSnH6s9mCX0sQfcxxsesAKEs7xx56lkrfxiw2xx7je2aoojSW_2CRUtCiHSwB_fwVrP06hxUCrl_ubHEtrZ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCFYMVNxoiHWrzQbHfQmARYZIFuQQqXfhIykxUHdhkskCIJOIRzIFdmn7Gn5VrqiD-qSp17xam8eJ_kaBHdSpyx52z0IXxPWiEA-DGzjSegCBH6EnFEz_hhWg0JE1XVW8oUBPqd2O2D66cDrh0-k9gvt4UQscNV-TQ4pj_qUG32_4BmL8g4en5QDvEwjLjGdWNYQhcV9q632XcY1IPZaSVkmpmQHO5m5kKQ4UzJ2VPsm6Z_O-uSqYInHt9OsU7Mf1G639HruiUCeRnw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDlDB5934mMWMqI_Z4FyDN7vjX08zEzZpHBwRfAASatsiH-yDmNA-1f-LTwFHsE3kGX8XdAh388D8Wso008lv2H5vUlxk4AyPwGKRYs5z1rp19Y1FH82r3ore4LsUfNQpkANE5WKLl8s4PfTL0kXOXCsH8grMk1SzpwwkDKFGKVzwzQS82BIa6Q5SB3STxqkpqS5RIZkGBJAqd7kaXHNVv8pLFW8iWnY9kVuKy5K5u3hIhdNRNYMAbr6R0re3ZAGAQDZi66jx0b_3dU"
  ];

  places.forEach((place, i) => {
    let img = images[i % images.length];
    html += `
      <div class="place-card glass-card">
         <div class="place-image">
            <img src="${img}" alt="${place.name}">
            <div class="rating"><span class="material-symbols-outlined">star</span> ${place.rating || '4.5'}</div>
         </div>
         <div class="place-info">
            <h4>${place.name}</h4>
            <div class="place-meta"><span><span class="material-symbols-outlined text-muted">location_on</span> Near you</span> <span class="tag">${place.status}</span></div>
         </div>
      </div>
    `;
  });
  container.className = 'places-grid';
  container.innerHTML = html;
}
