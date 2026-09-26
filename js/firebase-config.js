// ==========================================================================
// Google Firebase Firestore Configuration for MosaEdits Client Reviews
// 100% Free Cloud Database (Connected & Active)
// ==========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyAd8_7inE8FBFTFJ71GxiAXQodmQ50_0no",
  authDomain: "mosaedits-aa502.firebaseapp.com",
  projectId: "mosaedits-aa502",
  storageBucket: "mosaedits-aa502.firebasestorage.app",
  messagingSenderId: "922284218039",
  appId: "1:922284218039:web:3fd7ab6d2b68b5c565df32",
  measurementId: "G-JH2EJ1NV05"
};

// Check if Firebase is ready
function isFirebaseConfigured() {
    return typeof firebase !== 'undefined' && 
           firebaseConfig && 
           firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== "YOUR_API_KEY";
}

// Initialize Firebase & Firestore
let db = null;
if (typeof firebase !== 'undefined') {
    try {
        if (isFirebaseConfigured()) {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('✅ Connected to Google Firebase Cloud Database (mosaedits-aa502)');
        }
    } catch (err) {
        console.warn('Firebase init warning:', err);
    }
}
