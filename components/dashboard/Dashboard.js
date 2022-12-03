import React from "react";
import { View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Callout } from "react-native-maps";
import Svg from "react-native-svg";
import {
  IconButton,
  Text,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";

import mapStyleJson from "./../../mapStyle.json";
import styles from "./styles";

const mapStyle = mapStyleJson["mapStyle"];

const initRegion = {
  latitude: 10.729567,
  longitude: 106.6930756,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const rmit = {
  latitude: 10.729567,
  longitude: 106.6930756,
};

const myLocation = {
  latitude: 10.795132588703474,
  longitude: 106.72191374093879,
};

const Dashboard = ({ navigation }) => {
	return (
	<View style={styles.container}>
		<StatusBar style="dark" backgroundColor="white" />
		<MapView
			style={styles.map}
			initialRegion={initRegion}
			customMapStyle={mapStyle}
		>
			<Marker
				coordinate={rmit}
				title={"RMIT"}
				description={"RMIT University"}
			>
				<Image
					style={styles.marker_icon}
					source={require("../../assets/location-dot.png")}
				></Image>
				<Callout tooltip>
					<View>
						<View style={styles.bubble}>
							<Text style={styles.locationName}>Location's name</Text>
							<Text>Description</Text>
							<Image
								style={styles.image}
								source={require("../../images/bingsu.webp")}
							/>
						</View>
					</View>
				</Callout>
			</Marker>

			<Marker
				coordinate={myLocation}
				title={"user"}
				description={"user info"}
			>
				<View
					style={{
						flexDirection: "row",
						backgroundColor: "#00bfff",
						borderTopLeftRadius: 60,
						borderTopRightRadius: 60,
						borderBottomRightRadius: 0,
						borderBottomLeftRadius: 60,
						transform: [{ rotate: "45deg" }],
						alignSelf: "flex-start",
						height: 45,
						width: 45
					}}
				>
					<Svg width={40} height={30}>
						<Image
							source={require("../../images/avatar.jpeg")}
							width={40}
							height={30}
							style={{
								height: 40,
								width: 40,
								transform: [{ rotate: "-45deg" }],
								borderRadius: 90,
								position: "absolute",
								left: 1.5, // 1.5
								bottom: -42 // -32
							}}
						/>
					</Svg>
				</View>
				<Callout>
					<View
						style={{
							flexDirection: "column",
							width: 100,
							height: 50
						}}
					>
						<Text
							style={{
								marginLeft: 2,
								marginBottom: 1,
								color: "black",
								fontWeight: "bold"
							}}
						>
							User name
						</Text>
						<Text
							style={{
								marginLeft: 2,
								color: "black"
							}}
						>
							Description
						</Text>
					</View>
				</Callout>
			</Marker>
		</MapView>
		<View style={styles.bottomContainer}>
			<View style={styles.bottomNav}>
				<IconButton
					icon={props => <Icon name="map-pin" {...props} />}
					color="#EE6548"
					style={{
						alignSelf: "center",
						overflow: "button",
						padding: 25,
						backgroundColor: "white",
						borderRadius: 10,
						margin: 16,
						...styles.shadowBtn
					}}
					onPress={() => navigation.navigate("Address")}
				/>
				<IconButton
					icon={props => <MIcon name="account-group" {...props} />}
					color="#9CC7CA"
					style={{
						alignSelf: "center",
						overflow: "button",
						padding: 25,
						backgroundColor: "white",
						borderRadius: 10,
						margin: 16,
						...styles.shadowBtn
					}}
					onPress={() => navigation.navigate("Groups")}
				/>
				<IconButton
					icon={props => <AIcon name="search1" {...props} />}
					color="#C2C2C2"
					style={{
						alignSelf: "center",
						padding: 25,
						backgroundColor: "white",
						borderRadius: 10,
						margin: 16,
						...styles.shadowBtn
					}}
					disabled={true}
				/>
			</View>
		</View>
		<View style={styles.sideContainer}>
			<IconButton
				icon={props => <FIcon name="bell" {...props} />}
				color="#9CC7CA"
				style={{
					alignSelf: "center",
					overflow: "button",
					padding: 25,
					backgroundColor: "white",
					borderRadius: 10,
					margin: 12,
					...styles.shadowBtn
				}}
				onPress={() => navigation.navigate("Notifications")}
			/>
			<IconButton
				icon={props => <AIcon name="setting" {...props} />}
				color="#9CC7CA"
				style={{
					alignSelf: "center",
					overflow: "button",
					padding: 25,
					backgroundColor: "white",
					borderRadius: 10,
					margin: 12,
					...styles.shadowBtn
				}}
				onPress={() => navigation.navigate("Settings")}
			/>
			<IconButton
				icon={props => <AIcon name="contacts" {...props} />}
				color="#9CC7CA"
				style={{
					alignSelf: "center",
					overflow: "button",
					padding: 25,
					backgroundColor: "white",
					borderRadius: 10,
					margin: 12,
					...styles.shadowBtn
				}}
				onPress={() => navigation.navigate("Friends")}
			/>
		</View>
	</View>
	)
};

export default Dashboard;
