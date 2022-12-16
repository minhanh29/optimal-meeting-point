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
		padding: 17,
		backgroundColor: "transparent",
        borderColor: 'transparent',
		fontFamily: "Montserrat",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        margin: 0,
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
	iconImg:{
        fontSize: 20,
        backgroundColor: 'transparent',
        padding: 17,
		borderRadius: 15,
    },
	searchHolder:{
        backgroundColor: 'white',
        borderRadius: 15,
    },
	searchInput: {
		width: "80%",
		paddingTop: 14,
        paddingBottom: 14,
		backgroundColor: "white",
        borderColor: 'transparent',
		fontFamily: "Montserrat",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderRadius: 15,
	},
})

export default styles;
