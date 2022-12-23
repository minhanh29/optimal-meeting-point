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

import {
	ref,
	uploadBytes,
	uploadString,
	deleteObject,
	getDownloadURL,
	getStorage,
} from 'firebase/storage'


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

export const storage = getStorage(app)

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

const getGroupName = (id) => {
	return getDoc(doc(db, "group", id));
}


const deleteGroup = (id) => {
	return deleteDoc(doc(db, "groupNuser", id))
}

const updateUser = (id, data) => {
	return setDoc(doc(db, "user", id), data, { merge: true })
};

const createGroupInvitation = (group_id, sender_id, receiver_id) => {
	return addDoc(collection(db, "group_invitation" ),{
		group_id,
		receiver_id,
		sender_id,
		created_at: new Date(),
		status: 0,
	})
}

const createFriendRequest = (sender_id, receiver_id) => {
	return addDoc(collection(db, "friend-request"), {
		receiver_id,
		sender_id,
		created_at: new Date();
		status: 0,
	})
}

// CLOUD STORAGE
const uploadFile = async (folderName, imageUri, fileName) => {
    // // Upload the file and metadata
    try {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function() {
				resolve(xhr.response);
			};
			xhr.onerror = function(e) {
				console.log(e);
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", imageUri, true);
			xhr.send(null);
		});

		const timestamp = (new Date()).getTime()
		const imageRef = ref(storage, `${folderName}/${timestamp}_${fileName}`)
        // await uploadBytes(imageRef, imageUri)
        await uploadBytes(imageRef, blob)
        const url = await getDownloadURL(imageRef)
        // console.log("URL" ,url)
        return {
			success: true,
			mess: url
        }
    } catch (error) {
        return {
			success: false,
			mess: error.message
        }
    }
}

const downloadFile = async (folderName, fileName) => {
	const imageRef = ref(storage, `${folderName}/ ${fileName}`)
		try {
		const url = await getDownloadURL(imageRef)
		return {
			success: true,
			mess: url
		}
	} catch (error) {
		return {
			success: false,
			mess: error.message
		}
	}
}


const deleteFile = async (folderName,fileName) => {
    const deleteRef = ref(storage, `${folderName}/ ${fileName}`)
    try {
      await deleteObject(deleteRef)
    } catch(error){
      return error.message
    }
}

const getPathToStorage = (url) => {
	const baseURL = 'https://firebasestorage.googleapis.com/v0/b/optimal-meeting-point.appspot.com/o/';
	let imagePath = url.replace(baseURL,'');
	const indexOfEndPath = imagePath.indexOf('?');
	imagePath= imagePath.substring(0, indexOfEndPath);
	imagePath = decodeURIComponent(imagePath);
	return imagePath;
}

const deleteFileByUrl = async (url) => {
    // var fileRef = storage.refFromURL(getPathToStorage(url))
    var fileRef = ref(storage, getPathToStorage(url))
    // var fileRef = refFromURL(storage, url)

    // Delete the file using the delete() method
    // return await fileRef.delete().then(() => {

    //     // File deleted successfully
    //     // console.log("File Deleted")
    // }).catch(function (error) {
    //     // Some Error occurred
    //     console.log(error.mess)
    // });
    try {
		await deleteObject(fileRef)
    } catch(error){
		console.log(error.message)
		return error.message
    }

	return null
}

// ============
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
	updateUser,
	uploadFile,
	downloadFile,
	deleteFile,
	deleteFileByUrl,
	createGroupInvitation,
	createFriendRequest
}
