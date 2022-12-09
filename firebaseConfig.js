import {
	doc,
  getDoc,
	setDoc,
	getFirestore,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut
} from 'firebase/auth';

import { initializeApp } from 'firebase/app';

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

const createUser = (id, name, username, ava_url, address, address_text, gps_enabled) => {
  return setDoc(doc(db, "user", id),{
    name,
    username,
    ava_url,
    address,
    address_text,
    gps_enabled,
    }
)};

const getUserInfo = (id) => {
  return getDoc(doc(db, "user", id))
};

const createGroup = (data) => {
  return addDoc(collection(db, "group"), {
  ...data
});
}

const createGroupandUser = (data) => {
  return addDoc(collection(db, "groupNuser" ),{
    ...data
  })
}

const getGroupName = () => {
	return getDocs(collection(db, "group"));
}


const deleteGroup = (id) => {
	return deleteDoc(doc(db, "groupNuser", id))
}


export {
  createUserWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
  createUser,
  getUserInfo,
  auth,
  createGroup,
  createGroupandUser,
  getGroupName,
  deleteGroup,
}
