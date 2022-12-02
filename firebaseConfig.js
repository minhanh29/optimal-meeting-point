import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {
	doc,
	setDoc,
} from 'firebase/firestore'
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut
} from 'firebase/auth';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHqdOH96s_9K08o8TBSNVoP4p06wQRawk",
  authDomain: "optimal-meeting-point.firebaseapp.com",
  projectId: "optimal-meeting-point",
  storageBucket: "optimal-meeting-point.appspot.com",
  messagingSenderId: "109193486522",
  appId: "1:109193486522:web:2213cb54bf744b386ee283",
  measurementId: "G-32DFTP1HEV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
const auth = getAuth();

const createUser = (id, name, email, ava_url, address, hash) => {
  return setDoc(doc( db, "user", id),{
    name,
    username,
    ava_url,
    address,
    gps_enabled,
    hash
    }
  )}

export {
  createUserWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
  createUser,
}