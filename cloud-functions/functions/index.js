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
