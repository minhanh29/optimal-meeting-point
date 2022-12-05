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

export const db = getFirestore(app)
export const auth = getAuth();

const createUser = (id, name, username, ava_url, address, address_text, gps_enabled) => {
  return setDoc(doc( db, "user", id),{
    name,
    username,
    ava_url,
    address,
	address_text,
    gps_enabled,
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