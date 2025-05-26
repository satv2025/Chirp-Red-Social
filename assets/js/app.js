import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query,
  orderBy, doc, updateDoc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile, signInAnonymously
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMaLHgK2HUFST3Jz6wIB_aWTi1qutTOiI",
  authDomain: "chirpnow2025.firebaseapp.com",
  projectId: "chirpnow2025",
  storageBucket: "chirpnow2025.appspot.com",
  messagingSenderId: "35692380687",
  appId: "1:35692380687:web:83d1452151e4baf686d97a",
  measurementId: "G-YSR6R1X7VZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  app, analytics, db, auth,
  collection, addDoc, onSnapshot, query, orderBy,
  doc, updateDoc, getDoc, setDoc,
  onAuthStateChanged, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  signInAnonymously
};