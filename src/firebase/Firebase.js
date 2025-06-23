// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtNlKb92WJl-U8eL-hdxzfIG5gdKJKcAA",
  authDomain: "hotelbooking-app-1d34f.firebaseapp.com",
  projectId: "hotelbooking-app-1d34f",
  storageBucket: "hotelbooking-app-1d34f.appspot.com",
  messagingSenderId: "523697257962",
  appId: "1:523697257962:web:a28e5c4dad8815452cc693",
  clientId: "523697257962-ifpefu81dilb98ar6a9fn5l6i75mr139.apps.googleusercontent.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider };
export const storage = getStorage(app);