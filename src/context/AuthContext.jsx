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
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]     = useState(null);
  const [firebaseAdmin, setFirebaseAdmin] = useState(false); // true when /adminRoles/{uid} doc exists
  const [loading, setLoading]             = useState(true);

  // Shared maintenance state — readable by both Settings.jsx and App.jsx
  const [maintenanceActive, setMaintenanceActive] = useState(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/settings/maintenance`);
        const data = await res.json();
        if (data.success && data.data.active) {
          const estimated = new Date(data.data.estimatedCompletion);
          setMaintenanceActive({
            startDate: new Date().toISOString().split('T')[0], // approx
            startTime: '00:00',
            endDate: estimated.toISOString().split('T')[0],
            endTime: estimated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            message: data.data.message
          });
        }
      } catch (err) {
        console.error('Failed to fetch maintenance status', err);
      }
    };
    fetchMaintenance();
  }, []);

  // Admin status is determined solely by Firestore — no client-side override
  const isAdmin = firebaseAdmin;

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
    setFirebaseAdmin(false);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Admin role is controlled server-side via Firestore /adminRoles/{uid}
          // To grant admin: add a document at adminRoles/{firebase-uid} in the Firebase console
          const roleSnap = await getDoc(doc(db, 'adminRoles', user.uid));
          setFirebaseAdmin(roleSnap.exists());
        } catch (err) {
          console.error("Firestore Admin Role Error:", err);
          // If Firestore rules block the read, default to non-admin safely
          setFirebaseAdmin(false);
        }
      } else {
        setFirebaseAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    authReady: !loading,   // true once onAuthStateChanged has fired
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
