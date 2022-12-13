import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from "../../styles"

const styles = StyleSheet.create({
	...globalStyles,
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
	textInput: {
		width: "100%",
		borderRadius: 15,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowColor: "black",
		padding: 15,
		backgroundColor: "white",
		fontFamily: "Montserrat",
		elevation: 4,
	},
	cardHeader: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
	},
	infoContent: {
		fontFamily: "Montserrat",
		fontSize: 10,
		width: "70%"
	},
	buttonContainer: {
		width: "80%",
		borderRadius: 15,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowColor: "black",
		padding: 17,
		elevation: 4,
		marginBottom: "15%"
	},
	buttonTitle: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
		textAlign: 'center',
	},
	textContent: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
	},
})

export default styles;
