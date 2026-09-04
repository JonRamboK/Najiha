// Najiha Closet — Firebase configuration
// Replace the placeholder values below with your real Firebase project config
// (Firebase console → Project settings → General → Your apps → SDK setup and configuration)

export const firebaseConfig = {
  aapiKey: "AIzaSyBIkL-LV7a9ev6TkW2-EwHQjHMKIyok3Fo",
  authDomain: "najiha-closet.firebaseapp.com",
  projectId: "najiha-closet",
  storageBucket: "najiha-closet.firebasestorage.app",
  messagingSenderId: "1050940124563",
  appId: "1:1050940124563:web:e518019f04e5a0c6d78c66"
};

// Toggle: while no real config is pasted above, the site runs in demo mode
// (localStorage-backed data, no real network calls) so every page still works.
export const DEMO_MODE = firebaseConfig.apiKey === "YOUR_API_KEY";
