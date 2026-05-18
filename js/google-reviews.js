// Fetches real Google reviews for EuroCraft and renders them into the
// testimonials section. Filters to >= cfg.reviews.minRating stars.
//
// Required DOM: any container with [data-google-reviews-track].
// Optional DOM: [data-google-rating-score], [data-google-rating-count],
// [data-google-rating-link] — these get updated with live numbers.
(function () {
  const cfg = window.EC_GOOGLE_CONFIG;
  if (!window.EC_GOOGLE_READY || !cfg) return;

  const track = document.querySelector('[data-google-reviews-track]');
  if (!track) return;

  const scoreEl = document.querySelector('[data-google-rating-score]');
  const countEl = document.querySelector('[data-google-rating-count]');
  const linkEl  = document.querySelector('[data-google-rating-link]');

  async function findPlaceId() {
    if (cfg.placeId) return cfg.placeId;
    const { Place } = await google.maps.importLibrary('places');
    const req = {
      textQuery: `${cfg.business.name} ${cfg.business.address}`,
      fields: ['id', 'displayName', 'formattedAddress']
    };
    const { places } = await Place.searchByText(req);
    if (!places || !places.length) throw new Error('No place found');
    console.info('[EuroCraft] Discovered placeId — paste into google-config.js:', places[0].id);
    return places[0].id;
  }

  async function loadReviews() {
    try {
      const placeId = await findPlaceId();
      const { Place } = await google.maps.importLibrary('places');
      const place = new Place({ id: placeId });
      await place.fetchFields({
        fields: ['displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI']
      });

      const min = cfg.reviews.minRating ?? 4;
      const max = cfg.reviews.maxCount ?? 5;
      const reviews = (place.reviews || [])
        .filter(r => (r.rating ?? 0) >= min)
        .slice(0, max);

      updateRatingBadge(place);

      if (!reviews.length) {
        track.innerHTML = renderFallback(place.googleMapsURI);
        return;
      }
      track.innerHTML = reviews.map(renderReview).join('');
    } catch (err) {
      console.error('[EuroCraft] Failed to load Google reviews:', err);
      track.innerHTML = renderFallback();
    }
  }

  function updateRatingBadge(place) {
    if (scoreEl && typeof place.rating === 'number') {
      scoreEl.textContent = place.rating.toFixed(1);
    }
    if (countEl && typeof place.userRatingCount === 'number') {
      countEl.textContent = `Based on ${place.userRatingCount} Google Reviews`;
    }
    if (linkEl && place.googleMapsURI) {
      linkEl.href = place.googleMapsURI;
    }
  }

  function renderReview(r) {
    const stars = '★'.repeat(Math.round(r.rating || 5)) + '☆'.repeat(5 - Math.round(r.rating || 5));
    const initial = (r.authorAttribution?.displayName || '?').charAt(0).toUpperCase();
    const name = escapeHtml(r.authorAttribution?.displayName || 'Verified Customer');
    const dateText = r.relativePublishTimeDescription || '';
    const text = escapeHtml(r.text?.text || r.originalText?.text || '');
    return `
      <div class="testimonial">
        <div class="stars">${stars}</div>
        <blockquote>"${text}"</blockquote>
        <div class="author">
          <div class="avatar">${initial}</div>
          <div class="author-info">
            <strong>${name}</strong>
            <span>${dateText} · Google Review</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderFallback(url) {
    const href = url || 'https://www.google.com/maps/search/?api=1&query=EuroCraft+Automotive+Orlando';
    return `
      <div class="testimonial">
        <blockquote>Read our verified Google reviews from European car owners across Orlando.</blockquote>
        <a class="btn btn-primary" href="${href}" target="_blank" rel="noopener">
          <span>See Google Reviews <span class="arrow">→</span></span>
        </a>
      </div>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Defer until DOM and loader both ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReviews);
  } else {
    loadReviews();
  }
})();
