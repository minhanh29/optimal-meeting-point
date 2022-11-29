import * as Location from 'expo-location';


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

