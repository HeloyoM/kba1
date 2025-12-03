// Import the functions you need from the SDKs you need
import { initializeApp, } from "firebase/app";
import { getAuth, GoogleAuthProvider, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpFbNDNIgGKViRTDjUo9w5uj8l5lF5Ujo",
  authDomain: "kba-10.firebaseapp.com",
  projectId: "kba-10",
  storageBucket: "kba-10.firebasestorage.app",
  messagingSenderId: "673592063163",
  appId: "1:673592063163:web:628d09ed923de93b0fe59e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
auth.setPersistence(getReactNativePersistence(ReactNativeAsyncStorage));

export { auth, db, app }