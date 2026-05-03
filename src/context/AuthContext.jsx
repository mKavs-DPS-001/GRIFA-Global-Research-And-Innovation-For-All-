import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const HARDCODED_ADMIN_UID = "PLACEHOLDER_ADMIN_UID";

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]     = useState(null);
  const [firebaseAdmin, setFirebaseAdmin] = useState(false); // true when UID matches
  const [adminOverride, setAdminOverride] = useState(false); // manual toggle for testing
  const [loading, setLoading]             = useState(true);

  // Shared maintenance state — readable by both Settings.jsx and App.jsx
  const [maintenanceActive, setMaintenanceActive] = useState(null);

  // Effective admin flag — Firebase UID match OR manual override
  const isAdmin = firebaseAdmin || adminOverride;

  function toggleAdminMode() {
    setAdminOverride(prev => !prev);
  }

  async function register(email, password, additionalData) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      ...additionalData,
      createdAt: new Date()
    });
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function logout() {
    setAdminOverride(false); // clear override on logout
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setFirebaseAdmin(Boolean(user && user.uid === HARDCODED_ADMIN_UID));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    adminOverride,
    authReady: !loading,   // true once onAuthStateChanged has fired
    toggleAdminMode,
    login,
    loginWithGoogle,
    register,
    logout,
    // Maintenance
    maintenanceActive,
    setMaintenanceActive,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
