// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD_LRP6H5_YOmyLyepdbJHxgC6iNC6lNvo",
  authDomain: "webchat-c0fbb.firebaseapp.com",
  projectId: "webchat-c0fbb",
  storageBucket: "webchat-c0fbb.firebasestorage.app",
  messagingSenderId: "886976652070",
  appId: "1:886976652070:web:660a48cfaecc782c4957e7",
  measurementId: "G-8PNTKHSF36"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier };
export type { User };