import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
	AppBar, HStack, IconButton, Stack, Text, Image
} from "@react-native-material/core";

import mapStyleJson from "./mapStyle.json"
import ava from "./images/naruto_ava.jpg"

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

const App = () => {
	return (
		<View>
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
					image={ava}
				/>
			</MapView>
		</View>
	);
}

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
});

export default App;


