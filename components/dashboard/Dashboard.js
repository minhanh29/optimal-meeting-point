import React, { useState, useCallback, useRef, useMemo } from "react";
import { View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Svg from "react-native-svg";
import { IconButton, Text } from "@react-native-material/core";
import Icon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import mapStyleJson from "./../../mapStyle.json";
import styles from "./styles";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";

import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";

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

const renderContent = () => (
	<View style={styles.panel}>
		<View>
			<Text style={styles.panelTitle}>Location's Name</Text>
			<Text style={styles.panelSubtitle}>Location's Address</Text>
		</View>
		<TouchableOpacity style={styles.panelButton}>
			<Text style={styles.panelButtonTitle}>Choose This Location</Text>
		</TouchableOpacity>
	</View>
);

const renderHeader = () => (
	<View style={styles.headerBottomSheet}>
		<View style={styles.panelHeader}>
			<View style={styles.panelHandle}></View>
		</View>
	</View>
);

const sheetRef = React.createRef();
const fall = new Animated.Value(1);

const Dashboard = ({ navigation }) => {
	const user = useSelector(selectUser)
	const [marker, setMarker] = useState(null)
	// console.log(marker)

	// console.log("User Info", user.user.address)
	return (
	<View style={styles.container}>
		<StatusBar style="dark" backgroundColor="white" />
		<MapView
			style={styles.map}
			initialRegion={initRegion}
			customMapStyle={mapStyle}
			provider={PROVIDER_GOOGLE}
			onPress={ (event) => setMarker(event.nativeEvent.coordinate) }
		>
			{marker && 
				<Marker
					coordinate={marker}
				></Marker>
			}
			<Marker
				coordinate={rmit}
				// title={"RMIT"}
				// description={"RMIT University"}
			>
				<TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}>
					<Image
						style={styles.marker_icon}
						source={require("../../assets/location-dot.png")}
					></Image>
				</TouchableOpacity>
			</Marker>

			{/* // User's location */}
			<Marker coordinate={myLocation} title={"user"}>
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
		<BottomSheet
			ref={sheetRef}
			snapPoints={[550, 300, 0]}
			style={styles.bottomSheetContainer}
			renderContent={renderContent}
			renderHeader={renderHeader}
			initialSnap={2}
			callbackNode={fall}
			enabledGestureInteraction={true}
		/>
		<View style={styles.bottomContainer}>
			<View style={styles.bottomNav}>
				<View
					style={{
						...styles.shadowBtn,
						shadowOpacity: Platform.OS == "ios" ? 0.25 : 0.5
					}}
				>
					<IconButton
						icon={props => <Icon name="map-pin" {...props} />}
						color="#EE6548"
						style={{
							alignSelf: "center",
							overflow: "hidden",
							padding: 25,
							backgroundColor: "white",
							borderRadius: 10,
							margin: 16,
							...styles.shadowBtn
						}}
						onPress={() => navigation.navigate("Address")}
					/>
				</View>
				<View
					style={{
						...styles.shadowBtn,
						shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
					}}
				>
					<IconButton
						icon={props => <MIcon name="account-group" {...props} />}
						color="#9CC7CA"
						style={{
							alignSelf: "center",
							padding: 25,
							backgroundColor: "white",
							borderRadius: 10,
							margin: 16,
							...styles.shadowBtn
						}}
						onPress={() => navigation.navigate("Groups")}
					/>
				</View>
				<View
					style={{
						...styles.shadowBtn,
						shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
					}}
				>
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
					/>
				</View>
			</View>
		</View>
		<View style={styles.sideContainer}>
			<View
				style={{
					...styles.shadowBtn,
					shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
				}}
			>
				<IconButton
					icon={props => <FIcon name="bell" {...props} />}
					color="#9CC7CA"
					style={{
						alignSelf: "center",
						padding: 25,
						backgroundColor: "white",
						borderRadius: 10,
						margin: 12,
						...styles.shadowBtn
					}}
					onPress={() => navigation.navigate("Notifications")}
				/>
			</View>
			<View
				style={{
					...styles.shadowBtn,
					shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
				}}
			>
				<IconButton
					icon={props => <AIcon name="setting" {...props} />}
					color="#9CC7CA"
					style={{
						alignSelf: "center",
						padding: 25,
						backgroundColor: "white",
						borderRadius: 10,
						margin: 12,
						...styles.shadowBtn
					}}
					onPress={() => navigation.navigate("Settings")}
				/>
			</View>
			<View
				style={{
					...styles.shadowBtn,
					shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
				}}
			>
				<IconButton
					icon={props => <AIcon name="contacts" {...props} />}
					color="#9CC7CA"
					style={{
						alignSelf: "center",
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
	</View>
  );
};

export default Dashboard;
