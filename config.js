import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
   // Import the functions you need from the SDKs you need
   import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
   // TODO: Add SDKs for Firebase products that you want to use
   // https://firebase.google.com/docs/web/setup#available-libraries
 
   // Your web app's Firebase configuration
   const firebaseConfig = {
     apiKey: "AIzaSyBIkL-LV7a9ev6TkW2-EwHQjHMKIyok3Fo",
     authDomain: "najiha-closet.firebaseapp.com",
     projectId: "najiha-closet",
     storageBucket: "najiha-closet.firebasestorage.app",
     messagingSenderId: "1050940124563",
     appId: "1:1050940124563:web:e518019f04e5a0c6d78c66"
   };
 
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);