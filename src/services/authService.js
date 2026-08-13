import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const authService = {
  login: async ({ email, password, role }) => {
    try {
      console.log("[authService.login] Attempting login:", { email, role });
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, user } = data;
      
      localStorage.setItem('redconnect_user', JSON.stringify(user));
      localStorage.setItem('redconnect_selected_role', user.role);
      localStorage.setItem('redconnect_token', token);
      localStorage.setItem('redconnect_refresh_token', '');
      
      return { token, refreshToken: '', user };
    } catch (error) {
      console.error("[authService.login] Error:", error.message);
      throw error;
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
          // Serialize Firestore Timestamp → ISO string
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
          createdAt: serverTimestamp(), // ← only in Firestore write
        };
        await setDoc(userDocRef, firestoreUser);
        console.log("[authService.loginWithGoogle] Firestore document created for UID:", user.uid);
        // For Redux payload use plain serializable value
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
          createdAt: now, // ← plain ISO string, safe for Redux & localStorage
        };
      }
      
      localStorage.setItem('redconnect_user', JSON.stringify(fullUser));
      localStorage.setItem('redconnect_selected_role', fullUser.role);
      
      const token = await user.getIdToken();
      localStorage.setItem('redconnect_token', token);
      localStorage.setItem('redconnect_refresh_token', user.refreshToken || '');
      return { token, refreshToken: user.refreshToken, user: fullUser };
    } catch (error) {
      console.error("[authService.loginWithGoogle] Error:", error.code, error.message, error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      console.log("[authService.signup] Attempting signup:", { email: userData.email, role: userData.role });
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { token, user } = data;
      
      localStorage.setItem('redconnect_user', JSON.stringify(user));
      localStorage.setItem('redconnect_selected_role', user.role);
      localStorage.setItem('redconnect_token', token);
      localStorage.setItem('redconnect_refresh_token', '');
      
      return { token, refreshToken: '', user };
    } catch (error) {
      console.error("[authService.signup] Error:", error.message);
      throw error;
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
