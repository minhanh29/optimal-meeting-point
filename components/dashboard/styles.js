import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	bottomContainer: {
		width: '100%',
		position: 'absolute',
		bottom: '5%',
		backgroundColor: 'transparent',
	},
	bottomNav: {
		width: '100%',
		backgroundColor: "transparent",
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	sideContainer: {
		position: 'absolute',
		top: '8%',
		right: 0,
	},
	shadowBtn: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 7,
		},
		shadowOpacity: 0.50,
		shadowRadius: 13.97,

		elevation: 20,
	},
	marker_icon: {
		height: 35,
		width: 35,
	},
	bubble: {
		flexDirection: "column",
		alignSelf: "flex-start",
		backgroundColor: "#fff",
		borderRadius: 6,
		borderColor: "#ccc",
		borderWidth: 0.5,
		padding: 15,
		width: 200,
	},
	userCallout: {
		width: 100,
		height: 100,
	},
	locationName: {
		fontSize: 16,
		marginBottom: 5,
		fontWeight: "bold",
		marginBottom: 1,
	},
	arrow: {
		backgroundColor: "transparent",
		borderColor: "transparent",
		borderTopColor: "#fff",
		borderWidth: 16,
		alignSelf: "center",
		marginTop: -32,
	},
	arrowBorder: {
		backgroundColor: "transparent",
		borderColor: "transparent",
		borderTopColor: "#fff",
		borderWidth: 16,
		alignSelf: "center",
		marginTop: -0.5,
	},
	image: {
		width: 120,
		height: 80,
	},
})

export default styles;
