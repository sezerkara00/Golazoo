import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIszTHZkGbTymhVthDfEX1HdR5DOkyTEU",
  authDomain: "iddaa-app-8011f.firebaseapp.com",
  databaseURL: "https://iddaa-app-8011f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "iddaa-app-8011f",
  storageBucket: "iddaa-app-8011f.firebasestorage.app",
  messagingSenderId: "743923591761",
  appId: "1:743923591761:web:777f667d5f3bc1457da670",
  measurementId: "G-RCFHDG52F9"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore servislerini al
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app; 