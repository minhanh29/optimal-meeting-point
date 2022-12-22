import * as Location from 'expo-location';


export const geoToDict = (geopoint) => ({
	latitude: geopoint.latitude,
	longitude: geopoint.longitude,
})


// WOrk but return result that is not 100% correct, there is still very small error (LAT 21.0293916, "longitude": 105.8114705|"lat": 21.0295093, "lng": 105.8114684)
export const getAddressFromGeopoint = async (geopoint) => {
	if (!geopoint)
		return ""

	try {
		const { latitude, longitude } = geopoint;
		let response = await Location.reverseGeocodeAsync({
			latitude, longitude
		});

		for (let item of response) {
			let address = ""
			if (item.streetNumber) {
				address += item.streetNumber + ", "
			}

			if (item.street) {
				address += item.street + ", "
			}

			if (item.subregion) {
				address += item.subregion + ", "
			}

			if (item.region) {
				address += item.region + ", "
			}

			if (item.country) {
				address += item.country
			}

			return address
		}
	} catch(e) {
		console.log(e)
	}

	return ""
};


export const getGeoCodeFromAddress = async (address) => {
	if (!address)
		return ""

	try {
		// const { latitude, longitude } = geopoint;
		let response = await Location.geocodeAsync(address);
		console.log(response)
		// for (let item of response) {
		// 	let address = ""
		// 	if (item.streetNumber) {
		// 		address += item.streetNumber + ", "
		// 	}

		// 	if (item.street) {
		// 		address += item.street + ", "
		// 	}

		// 	if (item.subregion) {
		// 		address += item.subregion + ", "
		// 	}

		// 	if (item.region) {
		// 		address += item.region + ", "
		// 	}

		// 	if (item.country) {
		// 		address += item.country
		// 	}

			// return address
		// }
	} catch(e) {
		console.log(e)
	}

	return ""
};



