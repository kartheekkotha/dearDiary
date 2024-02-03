// firebase/firebase.js
import firebase from "firebase/app";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBUV4-0bZwm8SrKSWt8ZN-R0VwiZOOQL9Y",
  authDomain: "diary-blog-a0eb8.firebaseapp.com",
  projectId: "diary-blog-a0eb8",
  storageBucket: "diary-blog-a0eb8.appspot.com",
  messagingSenderId: "913518124574",
  appId: "1:913518124574:web:f2b78a111ebae09d3ed80f",
  measurementId: "G-L7H3YZWBJB",
};
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}
export const auth = getAuth(app);
