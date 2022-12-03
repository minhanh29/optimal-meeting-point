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