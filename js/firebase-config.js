// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
//import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js'

// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js'

import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js'

import { getStorage } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js'

// Copia tu configuración desde Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDpvzRGkS4dCtFaMNE8txG2sQkyADf86S8",
    authDomain: "sample-firebase-ai-app-ricard.firebaseapp.com",
    projectId: "sample-firebase-ai-app-ricard",
    storageBucket: "sample-firebase-ai-app-ricard.firebasestorage.app",
    messagingSenderId: "263035987865",
    appId: "1:263035987865:web:574b338d70d45d9c73d508"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);



