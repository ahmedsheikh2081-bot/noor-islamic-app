import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4COkptpIC2I4hEkK2ozVP2WZVI3EXbDs",
  authDomain: "noor-islamic-web.firebaseapp.com",
  projectId: "noor-islamic-web",
  storageBucket: "noor-islamic-web.firebasestorage.app",
  messagingSenderId: "574191176230",
  appId: "1:574191176230:web:86ea629d290847ac5d34e7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;