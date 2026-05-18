// Interactive Google Map for the contact page.
// Mounts into [data-google-map] and replaces any fallback content.
// Adds a marker with info window + Directions button.
(function () {
  const cfg = window.EC_GOOGLE_CONFIG;
  if (!window.EC_GOOGLE_READY || !cfg) return;

  const mountEl = document.querySelector('[data-google-map]');
  if (!mountEl) return;

  async function initMap() {
    try {
      const { Map, InfoWindow } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');

      const center = { lat: cfg.business.lat, lng: cfg.business.lng };

      const map = new Map(mountEl, {
        center,
        zoom: 15,
        mapId: 'EUROCRAFT_MAP',
        disableDefaultUI: false,
        clickableIcons: false,
        gestureHandling: 'cooperative'
      });

      const pin = new PinElement({
        background: '#d62828',
        borderColor: '#5a0d0d',
        glyphColor: '#ffffff'
      });

      const marker = new AdvancedMarkerElement({
        map,
        position: center,
        title: cfg.business.name,
        content: pin.element
      });

      const directionsUrl =
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cfg.business.address)}`;

      const info = new InfoWindow({
        content: `
          <div style="font-family:inherit;max-width:240px;line-height:1.45;">
            <strong style="font-size:1rem;">${escapeHtml(cfg.business.name)}</strong><br>
            <span style="color:#444;font-size:0.88rem;">${escapeHtml(cfg.business.address)}</span><br>
            <span style="color:#444;font-size:0.88rem;">${escapeHtml(cfg.business.hours)}</span><br>
            <div style="margin-top:8px;display:flex;gap:8px;">
              <a href="${directionsUrl}" target="_blank" rel="noopener"
                 style="color:#d62828;font-weight:600;text-decoration:none;font-size:0.92rem;">
                Get Directions →
              </a>
              <a href="tel:${cfg.business.phone}"
                 style="color:#222;font-weight:600;text-decoration:none;font-size:0.92rem;">
                Call
              </a>
            </div>
          </div>`
      });

      marker.addListener('click', () => info.open({ map, anchor: marker }));
      info.open({ map, anchor: marker });
    } catch (err) {
      console.error('[EuroCraft] Failed to init Google Map:', err);
      mountEl.classList.add('ec-map-failed');
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
