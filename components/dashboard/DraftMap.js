import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { View, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Callout } from "react-native-maps";
import Svg from "react-native-svg";
import { IconButton, Text } from "@react-native-material/core";
import Icon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import { MaterialIcons } from '@expo/vector-icons';
import mapStyleJson from "./../../mapStyle.json";
import styles from "./styles";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import { selectGroup} from "../../redux/reducers/groupSlice";
import { GOOGLE_MAPS_API_KEY } from '@env';

import { getGroupName } from "../../firebaseConfig"
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
const mapStyle = mapStyleJson["mapStyle"];

import { db } from "../../firebaseConfig"
import {
	ref,
	onValue,
	push,
	update,
	remove
} from 'firebase/database';

const radius = 2 * 1000;  // 2km
const placeType = "cafe"
const locationList = [
	{
	  latitude: 10.729567,
	  longitude: 106.6930756,
	},
	{
	  latitude: 10.795132588703474,
	  longitude: 106.72191374093879,
	},
	{
	  latitude: 10.715902,
	  longitude: 106.740016
	}
]

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

const AvaMarker = ({ava_url, location}) => {
	// const [users, setUsers] = useState([]);

	// useEffect(() => {
	// 	return onValue(ref(db, '/user'), querySnapShot => {
	// 	  let data = querySnapShot.val() || {};
	// 	  let users = {...data};
	// 	  setTodos(users);
	// 	});
	// }, []);
	return (
		<Marker coordinate={location} title={"user"}>
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
					source={{uri: ava_url}}
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
					width: 120,
					height: 30,
				}}
			>
				<Text
					style={{
						marginLeft: 2,
						marginBottom: 1,
						color: "black",
						fontWeight: "bold",
						alignSelf: "center",
					}}
				>
					User's name
				</Text>
				{/* <Text
					style={{
						marginLeft: 2,
						color: "black"
					}}
				>
					No need Description
				</Text> */}
			</View>
		</Callout>
	</Marker>
	)
			}

const Dashboard = ({ navigation }) => {
	const user = useSelector(selectUser)
	const group = useSelector(selectGroup)
	const [groupData, setGroupData] = useState(null)
	const [middlePoint, setMiddlePoint] = useState(null)
	const [suggestion, setSuggestion] = useState([])

	useEffect(() => {
		if (group.enterGroup) {
			fetchGroupData()
		}
	}, [group.enterGroup, group.groupId])

	const fetchGroupData = async () => {
		try {
			const group_data = await getGroupName(group.groupId)
			setGroupData(group_data.data())
		} catch (e) {
			console.log(e.message)
		}
	}

	const findMeetingPoints = () => {
		if (locationList.length == 0) {
			Alert.alert(
				"Error",
				"There must be at least one user's location",
				[{ text: "OK" }],
				{ cancelable: true }
			);
			return
		}

		let longitude = 0;
		let latitude = 0;
		for (let i = 0; i < locationList.length; i++) {
			latitude += locationList[i].latitude
			longitude += locationList[i].longitude
		}

		longitude /= locationList.length;
		latitude /= locationList.length;

		setMiddlePoint({longitude, latitude})

		const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=" + radius + "&type=" + placeType + "&key=" + GOOGLE_MAPS_API_KEY;
		fetch(url)
			.then(res => {
				return res.json();
			})
			.then(res => {
				let places = [];
				for (let i = 0; i < Math.min(res.results.length, 5); i++) {
					let googlePlace = res.results[i];
					let place = {};
					let myLat = googlePlace.geometry.location.lat;
					let myLong = googlePlace.geometry.location.lng;
					let coordinate = {
						latitude: myLat,
						longitude: myLong
					};
					place["placeTypes"] = googlePlace.types;
					place["coordinate"] = coordinate;
					place["placeId"] = googlePlace.place_id;
					place["placeName"] = googlePlace.name;
					places.push(place);
				}

				setSuggestion(places);
			})
			.catch(error => {
				console.log(error);
			});
	}

	// console.log("User Info", user.user.address)
	return (
	<View style={styles.container}>
		<StatusBar style="dark" backgroundColor="white" />
		<MapView
			style={styles.map}
			initialRegion={initRegion}
			customMapStyle={mapStyle}
		>

			{/* {middlePoint ? */}
			{/* <Marker */}
			{/* 	coordinate={middlePoint} */}
			{/* 	// title={"RMIT"} */}
			{/* 	// description={"RMIT University"} */}
			{/* > */}
			{/* 	<TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}> */}
			{/* 		<Image */}
			{/* 			style={styles.marker_icon} */}
			{/* 			source={require("../../assets/location-dot.png")} */}
			{/* 		></Image> */}
			{/* 	</TouchableOpacity> */}
			{/* </Marker>: null} */}
			{suggestion.map((place, i) => (
			<Marker
				key={i}
				coordinate={place.coordinate}
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
			))}

			{/* // User's location */}
			<AvaMarker ava_url="https://firebasestorage.googleapis.com/v0/b/optimal-meeting-point.appspot.com/o/avatar%2F1670923973578_9e26907c-bbcc-466c-bfef-be458126aadf.png?alt=media&token=7eae656e-8cff-4597-9c8d-70e627fe6f69" location={locationList[0]}/>
			<AvaMarker ava_url="https://gamek.mediacdn.vn/zoom/220_160/133514250583805952/2022/6/12/hinata-naruto-capture-560x337-16550242117671411683058.jpg" location={locationList[1]}/>
			<AvaMarker ava_url="https://cdn.popsww.com/blog/sites/2/2022/02/boruto-x-kawaki.jpg" location={locationList[2]}/>
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
		{groupData ?
		<View style={styles.topContainer}>
			<Text style={styles.topTitle}>{groupData.group_name}</Text>
		</View> : null}

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
						// color="#C2C2C2"
						color="#EE6548"
						style={{
							alignSelf: "center",
							padding: 25,
							backgroundColor: "white",
							borderRadius: 10,
							margin: 16,
							...styles.shadowBtn
						}}
						onPress={findMeetingPoints}
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
			{groupData ? <View
				style={{
					...styles.shadowBtn,
					shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
				}}
			>
				<IconButton
					icon={props => <MaterialIcons name="info-outline" {...props} />}
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
			</View>: null}
		</View>
	</View>
  );
};

export default Dashboard;

