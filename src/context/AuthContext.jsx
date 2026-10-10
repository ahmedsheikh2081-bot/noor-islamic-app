import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  reload,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET / CREATE USER PROFILE
  // =========================
  const getUserProfile = async (firebaseUser) => {
    try {
      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userSnap = await getDoc(userRef);

      // =========================
      // USER ALREADY EXISTS
      // =========================
      if (userSnap.exists()) {
        const firestoreData = userSnap.data();

        const profileData = {
          uid: firebaseUser.uid,

          name:
            firestoreData.name ||
            firebaseUser.displayName ||
            "",

          email:
            firestoreData.email ||
            firebaseUser.email ||
            "",

          photoURL:
            firestoreData.photoURL ||
            firebaseUser.photoURL ||
            "",

          emailVerified:
            firebaseUser.emailVerified,

          updatedAt: serverTimestamp(),
        };

        if (!firestoreData.createdAt) {
          profileData.createdAt =
            serverTimestamp();
        }

        await setDoc(
          userRef,
          profileData,
          {
            merge: true,
          }
        );

        console.log(
          "Firestore user profile updated:",
          firebaseUser.uid
        );

        return {
          uid: firebaseUser.uid,

          name:
            firestoreData.name ||
            firebaseUser.displayName ||
            "",

          email:
            firestoreData.email ||
            firebaseUser.email ||
            "",

          photoURL:
            firestoreData.photoURL ||
            firebaseUser.photoURL ||
            "",

          emailVerified:
            firebaseUser.emailVerified,
        };
      }

      // =========================
      // CREATE NEW USER
      // =========================
      const newUserData = {
        uid: firebaseUser.uid,

        name:
          firebaseUser.displayName || "",

        email:
          firebaseUser.email || "",

        photoURL:
          firebaseUser.photoURL || "",

        emailVerified:
          firebaseUser.emailVerified,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      };

      await setDoc(
        userRef,
        newUserData
      );

      console.log(
        "Firestore user created:",
        firebaseUser.uid
      );

      return {
        uid: firebaseUser.uid,

        name:
          newUserData.name,

        email:
          newUserData.email,

        photoURL:
          newUserData.photoURL,

        emailVerified:
          firebaseUser.emailVerified,
      };
    } catch (error) {
      console.error(
        "Firestore profile error:",
        error
      );

      return {
        uid: firebaseUser.uid,

        name:
          firebaseUser.displayName || "",

        email:
          firebaseUser.email || "",

        photoURL:
          firebaseUser.photoURL || "",

        emailVerified:
          firebaseUser.emailVerified,
      };
    }
  };

  // =========================
  // AUTH STATE
  // =========================
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          try {
            if (firebaseUser) {
              const userData =
                await getUserProfile(
                  firebaseUser
                );

              setUser(userData);
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error(
              "Auth state error:",
              error
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (
    email,
    password
  ) => {
    try {
      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const firebaseUser =
        result.user;

      const userData =
        await getUserProfile(
          firebaseUser
        );

      setUser(userData);

      return userData;
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      throw error;
    }
  };

  // =========================
  // SIGNUP
  // =========================
  const signup = async (
    email,
    password
  ) => {
    try {
      // Create Firebase account
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const firebaseUser =
        result.user;

      // =========================
      // SEND EMAIL VERIFICATION
      // =========================
      await sendEmailVerification(
        firebaseUser
      );

      console.log(
        "Verification email sent to:",
        firebaseUser.email
      );

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userData = {
        uid: firebaseUser.uid,

        name:
          firebaseUser.displayName || "",

        email:
          firebaseUser.email || "",

        photoURL:
          firebaseUser.photoURL || "",

        emailVerified: false,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      };

      // =========================
      // SAVE USER TO FIRESTORE
      // =========================
      await setDoc(
        userRef,
        userData
      );

      console.log(
        "Signup user saved to Firestore:",
        firebaseUser.uid
      );

      const localUserData = {
        uid: firebaseUser.uid,

        name:
          userData.name,

        email:
          userData.email,

        photoURL:
          userData.photoURL,

        emailVerified: false,
      };

      setUser(
        localUserData
      );

      return localUserData;
    } catch (error) {
      console.error(
        "Signup / verification error:",
        error
      );

      throw error;
    }
  };

  // =========================
  // CHECK EMAIL VERIFICATION
  // =========================
  const checkEmailVerification =
    async () => {
      try {
        if (!auth.currentUser) {
          return false;
        }

        // Firebase user ko refresh/reload
        await reload(
          auth.currentUser
        );

        const firebaseUser =
          auth.currentUser;

        const isVerified =
          firebaseUser.emailVerified;

        // Firestore update
        const userRef = doc(
          db,
          "users",
          firebaseUser.uid
        );

        await setDoc(
          userRef,
          {
            emailVerified:
              isVerified,

            updatedAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        // Local state update
        setUser((previousUser) => ({
          ...previousUser,

          emailVerified:
            isVerified,
        }));

        return isVerified;
      } catch (error) {
        console.error(
          "Email verification check error:",
          error
        );

        throw error;
      }
    };

  // =========================
  // RESEND VERIFICATION EMAIL
  // =========================
  const resendVerificationEmail =
    async () => {
      try {
        if (!auth.currentUser) {
          throw new Error(
            "No authenticated user found."
          );
        }

        if (
          auth.currentUser.emailVerified
        ) {
          return;
        }

        await sendEmailVerification(
          auth.currentUser
        );

        console.log(
          "Verification email resent to:",
          auth.currentUser.email
        );
      } catch (error) {
        console.error(
          "Resend verification error:",
          error
        );

        throw error;
      }
    };

  // =========================
  // UPDATE USER PROFILE
  // =========================
  const updateUserProfile =
    async (updates = {}) => {
      if (!auth.currentUser) {
        throw new Error(
          "No authenticated user found."
        );
      }

      try {
        const firebaseUser =
          auth.currentUser;

        const userRef = doc(
          db,
          "users",
          firebaseUser.uid
        );

        // =========================
        // UPDATE FIREBASE AUTH
        // =========================
        const authUpdates = {};

        if (
          updates.name !==
          undefined
        ) {
          authUpdates.displayName =
            updates.name;
        }

        if (
          updates.photoURL !==
          undefined
        ) {
          authUpdates.photoURL =
            updates.photoURL;
        }

        if (
          Object.keys(
            authUpdates
          ).length > 0
        ) {
          await updateProfile(
            firebaseUser,
            authUpdates
          );
        }

        // =========================
        // UPDATE FIRESTORE
        // =========================
        const firestoreUpdates = {
          ...updates,

          uid: firebaseUser.uid,

          email:
            updates.email !==
            undefined
              ? updates.email
              : firebaseUser.email ||
                "",

          emailVerified:
            firebaseUser.emailVerified,

          updatedAt:
            serverTimestamp(),
        };

        await setDoc(
          userRef,
          firestoreUpdates,
          {
            merge: true,
          }
        );

        console.log(
          "User profile updated in Firestore:",
          firebaseUser.uid
        );

        // =========================
        // UPDATE LOCAL STATE
        // =========================
        const newUserData = {
          uid: firebaseUser.uid,

          name:
            updates.name !==
            undefined
              ? updates.name
              : user?.name ||
                firebaseUser.displayName ||
                "",

          email:
            updates.email !==
            undefined
              ? updates.email
              : user?.email ||
                firebaseUser.email ||
                "",

          photoURL:
            updates.photoURL !==
            undefined
              ? updates.photoURL
              : user?.photoURL ||
                firebaseUser.photoURL ||
                "",

          emailVerified:
            firebaseUser.emailVerified,
        };

        setUser(
          newUserData
        );

        return newUserData;
      } catch (error) {
        console.error(
          "Update profile error:",
          error
        );

        throw error;
      }
    };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        signup,
        logout,

        updateUserProfile,

        checkEmailVerification,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// useAuth Hook
// =========================
export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}

export default AuthContext;