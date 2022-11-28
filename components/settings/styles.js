import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
	cardContainer: {
		width: "80%",
		borderRadius: 15,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowColor: "black",
		padding: 17,
		backgroundColor: "white",
		elevation: 4,
	},
	cardHeader: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
	}
})

export default styles;
