import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	text: {
		fontFamily: "Montserrat",
		fontSize: 12,
	},
	header: {
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
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
		padding: 15,
		elevation: 4,
		marginBottom: "15%"
	},
	buttonTitle: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
		textAlign: 'center',
	},
})

export default styles;

