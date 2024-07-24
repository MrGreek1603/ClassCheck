// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZEUiPAPpfXoqvX1j4UwC02VfLvWPSFLA",
  authDomain: "aora-72bf3.firebaseapp.com",
  projectId: "aora-72bf3",
  storageBucket: "aora-72bf3.appspot.com",
  messagingSenderId: "714987554369",
  appId: "1:714987554369:web:575994cc391643eff728c0",
  measurementId: "G-VHCZM4C9GW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);