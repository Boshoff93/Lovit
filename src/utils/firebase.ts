// Import the functions you need from the SDKs you need
import { initializeApp, setLogLevel } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnGJh3n-wQysaf5ARVq7t1nAQKxC2oGkM",
  authDomain: "lovit-c8d66.firebaseapp.com",
  projectId: "lovit-c8d66",
  storageBucket: "lovit-c8d66.firebasestorage.app",
  messagingSenderId: "218606485885",
  appId: "1:218606485885:web:463b2d5bdf3f3d30c0cc14",
  measurementId: "G-S4M0PM3S4W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app; 