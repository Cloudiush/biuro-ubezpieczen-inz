import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDzPIFrp01ikurQBf7ymX9SGfe3uEk05o",
  authDomain: "biuro-ubezpieczen-inz.firebaseapp.com",
  projectId: "biuro-ubezpieczen-inz",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;