import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBE8CvDmEuJGBx-T4SFQaim1wV-EaqMZRU",
    authDomain: "attendance-cf17e.firebaseapp.com",
    projectId: "attendance-cf17e",
    storageBucket: "attendance-cf17e.appspot.com",
    messagingSenderId: "239071590312",
    appId: "1:239071590312:web:4168cb20adda9b430e0f9d",
    measurementId: "G-RSDGTFDJRF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
