import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBi9IpoSAS3r_o0oSlsMR2R5uzE29dexuc",
  authDomain: "ai-trip-planner-26882.firebaseapp.com",
  projectId: "ai-trip-planner-26882",
  storageBucket: "ai-trip-planner-26882.firebasestorage.app",
  messagingSenderId: "308980876471",
  appId: "1:308980876471:web:dafe22b3651ef22fc13932",
  measurementId: "G-WE2ZR3RXJG"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);