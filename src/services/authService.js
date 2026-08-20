import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

import { api } from "./api";

export const authService = {
  login: async ({ email, password, role }) => {
    try {
      console.log("[authService.login] Attempting login:", { email, role });
      
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, refreshToken, user } = data;
      
      localStorage.setItem('redconnect_user', JSON.stringify(user));
      localStorage.setItem('redconnect_selected_role', user.role);
      localStorage.setItem('redconnect_token', token);
      localStorage.setItem('redconnect_refresh_token', refreshToken || '');
      
      return { token, refreshToken: refreshToken || '', user };
    } catch (error) {
      console.error("[authService.login] Error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  loginWithGoogle: async (role = 'donor') => {
    try {
      console.log("[authService.loginWithGoogle] Starting Google sign-in. Role:", role);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log("[authService.loginWithGoogle] Google auth success. UID:", user.uid);
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let fullUser;
      if (userDoc.exists()) {
        const userData = userDoc.data();
        fullUser = {
          id: user.uid,
          email: user.email,
          ...userData,
          createdAt: userData.createdAt?.toDate?.()?.toISOString?.() ?? userData.createdAt ?? null,
        };
      } else {
        console.log("[authService.loginWithGoogle] New user — creating Firestore document.");
        const now = new Date().toISOString();
        const firestoreUser = {
          name: user.displayName || 'New User',
          email: user.email,
          role,
          phone: user.phoneNumber || '',
          bloodGroup: 'O+',
          isAvailable: true,
          rewardPoints: 100,
          totalDonations: 0,
          livesSaved: 0,
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, firestoreUser);
        fullUser = {
          id: user.uid,
          name: user.displayName || 'New User',
          email: user.email,
          role,
          phone: user.phoneNumber || '',
          bloodGroup: 'O+',
          isAvailable: true,
          rewardPoints: 100,
          totalDonations: 0,
          livesSaved: 0,
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          createdAt: now,
        };
      }
      
      let backendToken = await user.getIdToken();
      let backendRefresh = user.refreshToken || '';

      // Sync with Express backend to issue MongoDB session JWT if backend is reachable
      try {
        const backendRes = await api.post('/auth/google', {
          email: user.email,
          name: user.displayName,
          role: fullUser.role || role,
          avatar: user.photoURL,
          phone: user.phoneNumber,
        });
        if (backendRes.data && backendRes.data.success) {
          backendToken = backendRes.data.token;
          backendRefresh = backendRes.data.refreshToken || backendRefresh;
          fullUser = backendRes.data.user || fullUser;
        }
      } catch (backendErr) {
        console.warn("[authService.loginWithGoogle] Backend sync fallback to Firebase token:", backendErr.message);
      }

      localStorage.setItem('redconnect_user', JSON.stringify(fullUser));
      localStorage.setItem('redconnect_selected_role', fullUser.role);
      localStorage.setItem('redconnect_token', backendToken);
      localStorage.setItem('redconnect_refresh_token', backendRefresh);
      
      return { token: backendToken, refreshToken: backendRefresh, user: fullUser };
    } catch (error) {
      console.error("[authService.loginWithGoogle] Error:", error.code, error.message, error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      console.log("[authService.signup] Attempting signup:", { email: userData.email, role: userData.role });
      
      const response = await api.post('/auth/register', userData);
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const { token, refreshToken, user } = data;
      
      localStorage.setItem('redconnect_user', JSON.stringify(user));
      localStorage.setItem('redconnect_selected_role', user.role);
      localStorage.setItem('redconnect_token', token);
      localStorage.setItem('redconnect_refresh_token', refreshToken || '');
      
      return { token, refreshToken: refreshToken || '', user };
    } catch (error) {
      console.error("[authService.signup] Error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('redconnect_user');
      localStorage.removeItem('redconnect_selected_role');
      localStorage.removeItem('redconnect_token');
      localStorage.removeItem('redconnect_refresh_token');
      return true;
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
           const userData = userDoc.data();
           const fullUser = { id: user.uid, email: user.email, ...userData };
           localStorage.setItem('redconnect_user', JSON.stringify(fullUser));
           return fullUser;
        }
      }
      
      const storedUser = localStorage.getItem('redconnect_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null; 
    } catch (error) {
      console.error("Get Current User Error:", error);
      return null;
    }
  },
};
