// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBznoetd8_G-JqhSm7V6v2fDzhpo07rdo0",
  authDomain: "fullbrain-ext.firebaseapp.com",
  projectId: "fullbrain-ext",
  storageBucket: "fullbrain-ext.appspot.com",
  messagingSenderId: "753375323485",
  appId: "1:753375323485:web:0f0fb656e3e3961efbf4b4",
  measurementId: "G-XGZ6GDS1YB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

;