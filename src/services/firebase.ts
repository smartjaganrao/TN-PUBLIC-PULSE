import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// These values should be provided by the user in their .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
// Note: This will fail if config is missing, which is expected until the user configures it.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
