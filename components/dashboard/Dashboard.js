import React, { useState, useEffect } from 'react'
import { View, Dimensions } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import {
	AppBar, HStack, IconButton, Stack, Image, Text, Button
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialCommunityIcons"
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";


import mapStyleJson from "./../../mapStyle.json"
import styles from "./styles"

const mapStyle = mapStyleJson["mapStyle"]

const initRegion = {
	latitude: 10.729567,
	longitude: 106.6930756,
	latitudeDelta: 0.2,
	longitudeDelta: 0.2,
}

const myhome = {
  latitude: 10.729567,
  longitude: 106.6930756
}


const Dashboard = ({navigation}) => {
  return (
    <View style={styles.container}>
			<StatusBar style="dark" backgroundColor="white"/>
			<MapView
				style={styles.map}
				initialRegion={initRegion}
				customMapStyle={mapStyle}
			>
				<Marker
					coordinate={myhome}
					title="RMIT"
					description="RMIT University"
				/>
			</MapView>

			<View style={styles.bottomContainer}>
				<View style={styles.bottomNav}>
					<View style={{...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.25 : 0.5}}>
						<IconButton
						icon={props => <Icon name="map-pin" {...props} />}
						color="#EE6548"
						style={{ alignSelf: "center",overflow:'hidden',padding: 25, backgroundColor: 'white', borderRadius: 10, margin: 16,...styles.shadowBtn}}
						onPress={() => navigation.navigate("Address")}
					/>
					</View>
					<View style={{...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5}}>
						<IconButton
						icon={props => <MIcon name="account-group" {...props} />}
						color="#9CC7CA"
						style={{ alignSelf: "center", padding: 25, backgroundColor: 'white', borderRadius: 10, margin: 16,...styles.shadowBtn }}
						onPress={() => navigation.navigate("Groups")}
					/>
					</View>
					<View style={{...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5}}>
						<IconButton
						icon={props => <AIcon name="search1" {...props} />}
						color="#C2C2C2"
						style={{ alignSelf: "center", padding: 25, backgroundColor: 'white', borderRadius: 10, margin: 16, ...styles.shadowBtn}}
					/>
					</View>
				</View>
			</View>
			<View style={styles.sideContainer}>
					<View style={{...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5}}>
						<IconButton
							icon={props => <FIcon name="bell" {...props} />}
							color="#9CC7CA"
							style={{ alignSelf: "center", padding: 25, backgroundColor: 'white', borderRadius: 10, margin: 12,...styles.shadowBtn,}}
							onPress={() => navigation.navigate("Notifications")}
						/>
					</View>
					<View style={{...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5}}>
						<IconButton
							icon={props => <AIcon name="setting" {...props} />}
							color="#9CC7CA"
							style={{ alignSelf: "center", padding: 25, backgroundColor: 'white', borderRadius: 10, margin: 12, ...styles.shadowBtn,}}
							onPress={() => navigation.navigate("Settings")}
						/>
					</View>
					<View style={{...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5}}>
						<IconButton
							icon={props => <AIcon name="contacts" {...props} />}
							color="#9CC7CA"
							style={{ alignSelf: "center",  padding: 25, backgroundColor: 'white', borderRadius: 10, margin: 12, ...styles.shadowBtn,}}
							onPress={() => navigation.navigate("Friends")}
						/>
					</View>
			</View>

		</View>
  )
}

export default Dashboard

// const styles = StyleSheet.create({
//     container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	map: {
// 		width: Dimensions.get("window").width,
// 		height: Dimensions.get("window").height,
// 	},
// 	bottomContainer:{
// 		width: '100%',
// 		position: 'absolute',
// 		bottom: '5%',
// 		backgroundColor: 'transparent',
// 	},
// 	bottomNav:{
// 		width: '100%',
// 		backgroundColor: "transparent",
// 		borderRadius: 8,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		flexDirection: 'row',
// 	},
// 	sideContainer:{
// 		position: 'absolute',
// 		top: '8%',
// 		right: 0,
// 	},
// 	shadowBtn:{
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 7,
// 		},
// 		shadowOpacity: 0.53,
// 		shadowRadius: 13.97,

// 		elevation: 20,
// 	},
// })
