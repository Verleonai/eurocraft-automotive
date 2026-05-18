// Loads the Google Maps JS API once, with the libraries needed by reviews + map modules.
// Uses the official dynamic loader pattern so we never double-inject the script.
// https://developers.google.com/maps/documentation/javascript/load-maps-js-api
(function () {
  const cfg = window.EC_GOOGLE_CONFIG;
  if (!cfg || !cfg.apiKey || cfg.apiKey === 'API_KEY_PLACEHOLDER') {
    console.warn('[EuroCraft] Google API key not configured — reviews and map disabled.');
    document.documentElement.classList.add('ec-google-disabled');
    return;
  }

  // Standard inline bootstrap from Google's docs (rewritten for clarity).
  ((g) => {
    let h, a, k, p = 'The Google Maps JavaScript API',
        c = 'google', l = 'importLibrary', q = '__ib__',
        m = document, b = window;
    b = b[c] || (b[c] = {});
    const d = b.maps || (b.maps = {}),
          r = new Set(), e = new URLSearchParams(),
          u = () => h || (h = new Promise(async (f, n) => {
            a = m.createElement('script');
            e.set('libraries', [...r] + '');
            for (k in g) e.set(k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()), g[k]);
            e.set('callback', c + '.maps.' + q);
            a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
            d[q] = f;
            a.onerror = () => h = n(Error(p + ' could not load.'));
            a.nonce = m.querySelector('script[nonce]')?.nonce || '';
            m.head.append(a);
          }));
    d[l] ? console.warn(p + ' only loads once. Ignoring:', g)
         : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
  })({ key: cfg.apiKey, v: 'weekly' });

  window.EC_GOOGLE_READY = true;
})();
