import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// All Firebase credentials are loaded from .env.local (gitignored).
// Copy .env.local.example → .env.local and fill in your values.
// IMPORTANT: Rotate the API key in the Firebase Console — the old key was exposed in git.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard against duplicate-app error during HMR / hot reload
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, "grifa-8a19e");
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
