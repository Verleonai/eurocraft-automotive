// EuroCraft Google Maps Platform configuration.
// Replace API_KEY_PLACEHOLDER with a key that has Places API (New) + Maps JavaScript API enabled.
// Restrict the key by HTTP referrer to *.eurocraftautomotive.com.
//
// PLACE_ID: leave empty to auto-discover via text search on first load.
// After auto-discovery the console will log a one-line snippet — paste the
// returned place_id here to skip future lookups (saves one API call per page).
window.EC_GOOGLE_CONFIG = {
  apiKey: 'API_KEY_PLACEHOLDER',
  placeId: '',
  business: {
    name: 'EuroCraft Automotive',
    address: '9751 Delegates Drive, Suite 200, Orlando, FL 32837',
    lat: 28.4214,
    lng: -81.3977,
    phone: '+14075125877',
    hours: 'Mon–Fri 9:00 AM – 6:00 PM'
  },
  reviews: {
    minRating: 4,
    maxCount: 5,
    fallbackUrl: 'https://www.google.com/maps/place/?q=place_id:'
  }
};
