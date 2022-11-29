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
			let address = `${item.name}, ${item.street}, ${item.subregion}, ${item.region}, ${item.country}`;

			return address
		}
	} catch(e) {
		console.log(e)
	}

	return ""
};

