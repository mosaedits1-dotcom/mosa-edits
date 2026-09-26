// ==========================================================================
// Google Firebase Firestore Configuration for MosaEdits Client Reviews
// 100% Free Cloud Database (Spark Plan)
// ==========================================================================
// للربط مع مشروعك المجاني في Firebase:
// 1. افتح https://console.firebase.google.com بحساب جوجل الخاص بك
// 2. اضغط "Add Project" وسمّيه (مثلاً: mosa-edits-portfolio)
// 3. من القائمة الجانبية: اختر "Build" ثم "Firestore Database" واضغط "Create Database" (في وضع Test Mode)
// 4. اذهب لإعدادات المشروع (Project Settings) > General > في الأسفل اضغط على علامة الويب (</>) وسجل التطبيق
// 5. انسخ القيم واستبدل النصوص أدناه بالقيم الخاصة بك:

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// فحص تفعيل السحابة
function isFirebaseConfigured() {
    return typeof firebase !== 'undefined' && 
           firebaseConfig && 
           firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== "YOUR_API_KEY" &&
           firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

// تهيئة Firebase بأمان
let db = null;
if (typeof firebase !== 'undefined') {
    try {
        if (isFirebaseConfigured()) {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('✅ Connected to Google Firebase Cloud Database');
        } else {
            console.log('ℹ️ Firebase config pending. Operating in LocalStorage mode until keys are provided.');
        }
    } catch (err) {
        console.warn('Firebase init warning:', err);
    }
}
