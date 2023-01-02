// Import all needed modules.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');
// const { query } = require('firebase/firestore');
// const axios = require('axios').default;

// Set up Firestore.
admin.initializeApp();
const db = admin.firestore();

// Set up Algolia.
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndex = algoliaClient.initIndex("friends");


async function saveDocumentInAlgolia(record) {
	return await collectionIndex.saveObject(record);
}

async function updateDocumentInAlgolia(change) {
    const docBeforeChange = change.before.data()
    const docAfterChange = change.after.data()
    if (docBeforeChange && docAfterChange) {
		await saveDocumentInAlgolia(change.after);
    }
}

async function deleteDocumentFromAlgolia(snapshot) {
    if (snapshot.exists) {
        const objectID = snapshot.id;
        await collectionIndex.deleteObject(objectID);
    }
}

// Create a HTTP request cloud function.
exports.sendCollectionToAlgolia = functions.region('asia-northeast1').https.onRequest(async (req, res) => {

	try {
		// This array will contain all records to be indexed in Algolia.
		// A record does not need to necessarily contain all properties of the Firestore document,
		// only the relevant ones.
		const algoliaRecords = [];

		// Retrieve all documents from the COLLECTION collection.
		const querySnapshot1 = await db.collection('group').get();
		const querySnapshot2 = await db.collection('groupNuser').get()

		const groupNames = {}
		querySnapshot1.docs.forEach(doc => {
			const data = doc.data();
			groupNames[doc.id] = data.group_name
		});

		querySnapshot2.docs.forEach(doc => {
			const data = doc.data();
			if (data.group_id.trim() !== "") {
				const record = {
					objectID: doc.id,
					group_id: data.group_id,
					user_id: data.user_id,
					group_name: groupNames[data.group_id]
				}

				algoliaRecords.push(record);
			}
		})


		// After all records are created, we save them to
		collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
			res.status(200).send("COLLECTION was indexed to Algolia successfully.");
		});
	} catch (e) {
		console.log(e.message)
		res.status(500).send(e.message);
	}
})

exports.groupWriteListener = functions.region('asia-northeast1').firestore
	.document("groupNuser/{docID}")
	.onCreate((snap, context) => {
		console.log(snap.data())
		const group_id = snap.data().group_id.trim()
		console.log(group_id)
		db.collection("group").doc(group_id).get().then((group_data) => {
			const record = {
				objectID: snap.id,
				group_id: snap.data().group_id,
				user_id: snap.data().user_id,
				group_name: group_data.data().group_name,
			}
			console.log(group_data.data())
			saveDocumentInAlgolia(record)
			.then(res => console.log("Group is added to algolia", res))
			.catch(e => console.log("Algolia Add Error", e.message))
		})
	})

exports.friendWriteListener = functions.region('asia-northeast1').firestore
.document("friend/{docID}")
.onCreate(async (snap, context) => {
	console.log(snap.data())
	const person1_id = snap.data().person1_id
	const person2_id = snap.data().person2_id

	const person1 = await db.collection('user').doc(person1_id).get()
	console.log("person 1 data ", person1.data())
	
	const person1_info = {
		person1_id: person1_id,
		ava_url: person1.data().ava_url,
		name: person1.data().name,
		username: person1.data().username
	};
	const record = {
		objectID: snap.id,
		...person1_info,
		person2_id: person2_id
	};
	console.log(record)
		saveDocumentInAlgolia(record)
		.then(res => console.log("Friend is added to algolia", res))
		.catch(e => console.log("Algolia Add Error", e.message))
})

exports.groupUpdateFromGroupListener = functions.region('asia-northeast1').firestore
	.document("group/{docID}")
	.onUpdate((snap, context) =>{
		console.log(snap.after.id)

		db.collection("groupNuser").where("group_id", "==", snap.after.id).get().then((data) => {
			data.docs.forEach((doc) => {
				const record = {
					objectID: doc.id,
					group_id: doc.data().group_id,
					user_id: doc.data().user_id,
					group_name: snap.after.data().group_name,
				}
				console.log(record.group_name)
				saveDocumentInAlgolia(record)
				.then(res => console.log("Group info from group is updated to algolia", res))
				.catch(e => console.log("Algolia Update Error", e.message))
			})
		})
	})


exports.groupDeleteListener = functions.region('asia-northeast1').firestore
	.document("groupNuser/{docID}")
	.onDelete((change, context) => {
		deleteDocumentFromAlgolia(change)
			.then(res => console.log("Group is deleted to algolia", res))
			.catch(e => console.log("Algolia Delete Error", e.message))
	})

// friend
exports.sendFriendsToAlgolia = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
	try{
		const algoliaRecords = []

		const querySnapshot = await db.collection('friend').get()

		for(let i = 0; i < querySnapshot.docs.length; i++){
			let doc = querySnapshot.docs[i]
			const data = doc.data()
			const person1_id = data.person1_id;

			const person1 = await db.collection("user").doc(person1_id).get()
			console.log("person 1",person1)
			console.log("person 1 data ", person1.data())
			if(person1.data() === undefined){
				continue
			}
			const person1_info = {
				person1_id: person1_id,
				ava_url: person1.data().ava_url,
				name: person1.data().name,
				username: person1.data().username
			};

			const record = {
				objectID: doc.id,
				...person1_info,
				person2_id: data.person2_id
			};
			console.log(record)
			algoliaRecords.push(record);
			collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
			res.status(200).send("COLLECTION was indexed to Algolia successfully.");
			})
		};
 	} catch (e) {
		console.log(e.message)
		res.status(500).send(e.message);
	}
})


exports.friendUpdateListener = functions.region('asia-northeast1').firestore
	.document("user/{docId}")
	.onUpdate(async (change, context) => {
		const person1 = change.after.data()
		const querySnapshot = await db.collection('friend').where("person1_id", "==", change.after.id).get()
		for(let i  = 0; i < querySnapshot.docs.length; i++){
			let doc = querySnapshot.docs[i]
			let data = doc.data()

			if(person1 === undefined){
				continue
			}
			const person1_info = {
				person1_id: change.after.id,
				ava_url: person1.ava_url,
				name: person1.name,
				username: person1.username
			};
			const record = {
				objectID: doc.id,
				...person1_info,
				person2_id: data.person2_id
			}
			console.log("record", record)
			saveDocumentInAlgolia(record)
			.then(res => console.log("Group info from group is updated to algolia", res))
			.catch(e => console.log("Algolia Update Error", e.message))
		}
	})

exports.friendDeleteListenter = functions.region('asia-northeast1').firestore
	.document("friend/{docID}")
	.onDelete((change, context) => {
		deleteDocumentFromAlgolia(change)
			.then(res => console.log("Friend is deleted to algolia", res))
			.catch(e => console.log("Algolia Delete Error", e.message))
	})