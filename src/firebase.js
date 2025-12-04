// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAq3PBfdvghJkjv1_Kg8qC7YEhX-nw8vCA",
  authDomain: "sky-e4d53.firebaseapp.com",
  projectId: "sky-e4d53",
  storageBucket: "sky-e4d53.appspot.com",
  messagingSenderId: "383743365331",
  appId: "1:383743365331:web:107853e77e90358ee3c426",
  measurementId: "G-4ZQXKVQC0G",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

