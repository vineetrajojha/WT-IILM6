import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

 const firebaseConfig = {
    apiKey: "AIzaSyBnenzfXDuKCxSXQ9bcDbgr8_q3fmVovjM",
    authDomain: "student-portal-e60b8.firebaseapp.com",
    projectId: "student-portal-e60b8",
    storageBucket: "student-portal-e60b8.firebasestorage.app",
    messagingSenderId: "519178566468",
    appId: "1:519178566468:web:1838653ac91dc61dfef511"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };