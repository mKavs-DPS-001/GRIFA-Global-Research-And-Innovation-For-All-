import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEDdDGsMvhksroqdytrOaQsgo43hnJcyk",
  authDomain: "grifadpsp.firebaseapp.com",
  projectId: "grifadpsp",
  storageBucket: "grifadpsp.firebasestorage.app",
  messagingSenderId: "872942910319",
  appId: "1:872942910319:web:1cb7314b49704bb401869a"
};

// Guard against duplicate-app error during HMR / hot reload
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
