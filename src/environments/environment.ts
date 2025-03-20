export const environment = {

  baseUrl: process.env['APP_BASE_URL'] ?? 'http://localhost:3000/api/v1',

  firebase: {
    projectId: process.env['APP_FIREBASE_PROJECT_ID'],
    appId: process.env['FIREBASE_APP_ID'],
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
    locationId: process.env['FIREBASE_LOCATION_ID'],
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID']
  }

}
