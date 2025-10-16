import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCO91cmzF77qbKLCLbtMWCcnw_O--4l9pU",
  authDomain: "ecowashtracker.firebaseapp.com",
  projectId: "ecowashtracker",
  storageBucket: "ecowashtracker.firebasestorage.app",
  messagingSenderId: "357697203907",
  appId: "1:357697203907:web:8f9647cbc21e64856b7c76",
  measurementId: "G-7KKHPMMRXW"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with additional configuration
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
