// Najiha Closet — Firebase configuration
// Replace the placeholder values below with your real Firebase project config
// (Firebase console → Project settings → General → Your apps → SDK setup and configuration)

export const firebaseConfig = {
  apiKey: "AIzaSyBfWC26Nvc3LZji_io5747y94vnPuWIW2o",
  authDomain: "najiha-2c3ca.firebaseapp.com",
  databaseURL: "https://najiha-2c3ca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "najiha-2c3ca",
  storageBucket: "najiha-2c3ca.firebasestorage.app",
  messagingSenderId: "354444531724",
  appId: "1:354444531724:web:a26f19c0dd7e337e7a7629",
  measurementId: "G-HLK5CK8PES"
};

// Toggle: while no real config is pasted above, the site runs in demo mode
// (localStorage-backed data, no real network calls) so every page still works.
export const DEMO_MODE = firebaseConfig.apiKey === "YOUR_API_KEY";
