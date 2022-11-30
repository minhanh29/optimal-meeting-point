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
	bottomContainer:{
		width: '100%',
		position: 'absolute',
		bottom: '5%',
		backgroundColor: 'transparent',
	},
	bottomNav:{
		width: '100%',
		backgroundColor: "transparent",
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	sideContainer:{
		position: 'absolute',
		top: '8%',
		right: 0,
	},
	shadowBtn:{
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 7,
		},
		shadowOpacity: 0.53,
		shadowRadius: 13.97,

		elevation: 20,
	},
})

export default styles;
