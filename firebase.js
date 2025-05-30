import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";   //For Authentication
import { getFirestore } from "firebase/firestore";   //For Firestore
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyC8-1uBhjjyzI48i6SNTno3nwfW4Sa7Ixs",
  authDomain: "store-app-f25ec.firebaseapp.com",
  projectId: "store-app-f25ec",
  storageBucket: "store-app-f25ec.firebasestorage.app",
  messagingSenderId: "312948718048",
  appId: "1:312948718048:web:7be843e7688262cff75385",
  measurementId: "G-6M85SLENJ6"
};


// Initialize Firebase only if it hasn't been initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize auth
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;