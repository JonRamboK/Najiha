import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBfWC26Nvc3LZji_io5747y94vnPuWIW2o",
    authDomain: "najiha-2c3ca.firebaseapp.com",
    projectId: "najiha-2c3ca",
    storageBucket: "najiha-2c3ca.firebasestorage.app",
    messagingSenderId: "354444531724",
    appId: "1:354444531724:web:a26f19c0dd7e337e7a7629",
    measurementId: "G-HLK5CK8PES"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);