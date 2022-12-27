// Import all needed modules.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');
// const axios = require('axios').default;

// Set up Firestore.
admin.initializeApp();
const db = admin.firestore();

// Set up Algolia.
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndex = algoliaClient.initIndex("group");


async function saveDocumentInAlgolia(record) {
	await collectionIndex.saveObject(record);
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

exports.groupUpdateFromGroupListener = functions.region('asia-northeast1').firestore
	.document("group/{docID}")
	.onUpdate((change, context) =>{
		updateDocumentInAlgolia(change)
			.then(res => console.log("Group info from group is updated to algolia", res))
			.catch(e => console.log("Algolia Update Error", e.message))
	})

exports.groupUpdateFromGroupNuserListener = functions.region('asia-northeast1').firestore
	.document("groupNuser/{docID}")
	.onUpdate((change, context) =>{
		updateDocumentInAlgolia(change)
			.then(res => console.log("Group info from group is updated to algolia", res))
			.catch(e => console.log("Algolia Update Error", e.message))
	})

exports.groupDeleteListener = functions.region('asia-northeast1').firestore
	.document("groupNuser/{docID}")
	.onDelete((change, context) => {
		deleteDocumentFromAlgolia(change)
			.then(res => console.log("Group is deleted to algolia", res))
			.catch(e => console.log("Algolia Delete Error", e.message))
	})
