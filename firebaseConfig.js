import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import {
  getAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAEruFdWUHxazXD8QyZZGFF5hAuuqYykKM",
  authDomain: "eventbookingapp-6b977.firebaseapp.com",
  projectId: "eventbookingapp-6b977",
  storageBucket: "eventbookingapp-6b977.firebasestorage.app",
  messagingSenderId: "816895133161",
  appId: "1:816895133161:web:117461acf3e7a3b8527778",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Set the persistence for the web
setPersistence(auth, browserLocalPersistence) // Choose 'browserSessionPersistence' if you want session-level persistence
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Initialize Firestore
export const db = getFirestore(app);

// Firestore references
export const usersRef = collection(db, "users");
export const eventsRef = collection(db, "events");

export { auth };
