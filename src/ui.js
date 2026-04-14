/**
 * The UI Component handling pure DOM manipulations strictly safely.
 * Isolates presentation logic from business intelligence orchestrations.
 * @module ui
 */

/**
 * Mutates the DOM to cleanly animate and inject the JSON payload visually.
 * Respects strict ARIA requirements dynamically.
 * @param {Object} decision - Extracted engine decision JSON object.
 */
export function updateResponseUI(decision) {
  const container = document.getElementById('ai-response-container');
  if(!container) return; // Silent fail boundary constraint

  const isPositive = decision.score >= 65;
  const pillClass = isPositive ? 'eat-recommended' : 'avoid';
  const pillIcon = isPositive ? 'check_circle' : 'warning';
  
  // Dash Offset Math isolating animation bounds
  const offset = 440 * (1 - (decision.score / 100));

  container.innerHTML = `
    <div class="score-circle" aria-hidden="true">
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
      <span class="material-symbols-outlined" aria-hidden="true" style="font-variation-settings: 'FILL' 1;">${pillIcon}</span> ${decision.decision.toUpperCase()}
    </div>
    
    <div class="insight-text">
      <h3>Precision Insight</h3>
      <p>${decision.explanation}</p>
    </div>
  `;

  const altContainer = document.getElementById('alternatives-container');
  if (altContainer) {
    let listHtml = '';
    decision.alternatives.forEach(alt => {
      listHtml += `
        <div class="alt-item">
          <div class="alt-info">
            <div class="icon-box"><span class="material-symbols-outlined" aria-hidden="true">eco</span></div>
            <div>
              <p>${alt}</p>
              <span>Algorithmic Matching Engine</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-tertiary" aria-hidden="true">trending_up</span>
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
 * Renders spatial Google Maps places logic specifically into the presentation matrix organically.
 * @param {Array<Object>} places - Map outputs representing targeted geographic elements.
 * @param {HTMLElement} container - DOM reference object explicitly wrapping destinations.
 */
export function renderPlacesGrid(places, container) {
  if (places.length === 0) {
    container.innerHTML = '<p class="text-muted" style="grid-column: span 12;">No locations found matching constraints.</p>';
    return;
  }

  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD-3UJ1qjwVVl46iLATykaByNrsrDCzMTt4H1BsngJfIcYsVgOpiAMhOPJKrupM5LlkO8mWYTYIG12-JlzDfIuIi6uUNOX8IuXNt36j_mutDSBc8JZ7G9kLI-2ndA42YkNdLu65t7dPHJ1NUth8MC5-3qmGZXKooBEGHzea4QURwyIvTqOxqXqeG7bRhXSnH6s9mCX0sQfcxxsesAKEs7xx56lkrfxiw2xx7je2aoojSW_2CRUtCiHSwB_fwVrP06hxUCrl_ubHEtrZ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCFYMVNxoiHWrzQbHfQmARYZIFuQQqXfhIykxUHdhkskCIJOIRzIFdmn7Gn5VrqiD-qSp17xam8eJ_kaBHdSpyx52z0IXxPWiEA-DGzjSegCBH6EnFEz_hhWg0JE1XVW8oUBPqd2O2D66cDrh0-k9gvt4UQscNV-TQ4pj_qUG32_4BmL8g4en5QDvEwjLjGdWNYQhcV9q632XcY1IPZaSVkmpmQHO5m5kKQ4UzJ2VPsm6Z_O-uSqYInHt9OsU7Mf1G639HruiUCeRnw"
  ];

  let html = '';
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
            <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${place.description}</p>
         </div>
      </div>
    `;
  });
  container.innerHTML = html;
}
