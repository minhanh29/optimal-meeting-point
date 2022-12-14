import { StyleSheet } from 'react-native'
import globalStyles from "../../styles"

const styles = StyleSheet.create({
	...globalStyles,
	tabBarContainer: {
		backgroundColor: "#FAFCFD",
		overflow: "visible",
		borderRadius: 15,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowColor: "black",
		elevation: 4,
	},
	tabBarItem: {
		width: "50%",
		backgroundColor: "transparent",
		borderRadius: 15,
		padding: 15,
		elevation: 0,
	},
	tabBarItemTitle: {
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		textAlign: 'center',
		color: "black"
	},
	activeTabBarItem: {
		width: "50%",
		backgroundColor: "#EE6548",
		borderRadius: 15,
		padding: 15,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.6,
		shadowColor: "#e97056",
		elevation: 10,
	},
	activeTabBarItemTitle: {
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		textAlign: 'center',
		color: "white"
	},
	cardContainer: {
		width: "100%",
		borderRadius: 15,
		padding: 17,
		backgroundColor: "#FAFCFD",
		marginBottom: 15,
	},
	cardHeader: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
		color: "black"
	},
	cardContent: {
		width: "90%",
		flex: 1,
		fontFamily: "Montserrat",
		fontSize: 10,
		color: "black",
		flexWrap: 'wrap',
	},
})

export default styles;

