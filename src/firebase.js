import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDzPIFrp01ikurQBf7ymX9SGfe3uEk05o",
  authDomain: "biuro-ubezpieczen-inz.firebaseapp.com",
  projectId: "biuro-ubezpieczen-inz",
  storageBucket: "biuro-ubezpieczen-inz.firebasestorage.app",
  messagingSenderId: "190409297734",
  appId: "1:190409297734:web:322a775f2c37e316075f47"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://biuro-ubezpieczen-inz.firebasestorage.app");

export default app;