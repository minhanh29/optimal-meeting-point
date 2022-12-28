import React, { useState, useCallback, useRef, useMemo } from "react";
import { View, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Svg from "react-native-svg";
import { IconButton, Text } from "@react-native-material/core";
import Icon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialIcons";
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import mapStyleJson from "./../../mapStyle.json";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import { useTheme } from '@react-navigation/native';
import { GeoPoint } from "firebase/firestore";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from 'expo-location';
import { useEffect } from "react";
import { GROUP_IDLE, selectGroup, updateAddressAsync, UPDATE_ADDRESS_PENDING, UPDATE_ADDRESS_REJECTED, UPDATE_ADDRESS_SUCCESS, changeGroupStatus } from "../../redux/reducers/groupSlice";
import Spinner from 'react-native-loading-spinner-overlay';
import { GOONG_PUBLIC_KEY } from '@env';

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

const PinOnMap = ({ navigation }) => {
	const user = useSelector(selectUser)
	
	const group = useSelector(selectGroup)
	const dispatch = useDispatch()
	const { colors } = useTheme()
	const [marker, setMarker] = useState(null)
	console.log(marker)
	const [addressText, setAddressText] = useState(null)
	console.log("AddressText" ,addressText)


	useEffect(() => {
		if (group.status === UPDATE_ADDRESS_REJECTED) {
			Alert.alert(
				"Update Location",
				"Failed to update location",
				[
					{
						text: "OK",
					},
				],
				{ cancelable: true }
			)
			dispatch(changeGroupStatus(GROUP_IDLE))
		} if (group.status === UPDATE_ADDRESS_SUCCESS) {
			Alert.alert(
				"Update Location",
				"Group location has been updated successfully",
				[
					{
						text: "OK",
						//   onPress:() => navigation.goBack(),
					},
				],
				{ cancelable: true }
			)
			dispatch(changeGroupStatus(GROUP_IDLE))
		}
	}, [group.status])


	const updateGroupAddress = () => {
		const newAddress = {
			location: addressText,
			address: new GeoPoint(marker.latitude, marker.longitude),
		}

		const data = { groupId: group.groupId, newAddress }

		dispatch(updateAddressAsync(data));
	}

	const fetchData= async(data) =>{
		console.log("DATA", data)
		const {latitude, longitude} = data
		try{
			let  url =  "https://rsapi.goong.io/Geocode?latlng="+ latitude + ",%20"+ longitude + "&api_key=" + GOONG_PUBLIC_KEY
			let res = await fetch(url)
			res = await res.json()
			setAddressText(res.results[0].formatted_address)
		}catch(e){

		}
	}




	return (
		<View style={styles.container}>
			<Spinner
				visible={group.status === UPDATE_ADDRESS_PENDING}
				textContent={'Loading...'}
				textStyle={{ color: "white" }}
				cancelable={true}
			/>
			<StatusBar style="dark" backgroundColor="white" />
			<MapView
				style={styles.map}
				initialRegion={initRegion}
				customMapStyle={mapStyle}
				provider={PROVIDER_GOOGLE}
				onPress={(event) => {
					setMarker(event.nativeEvent.coordinate)
					fetchData(event.nativeEvent.coordinate)
				}}
			>
				{marker &&
					<Marker
						coordinate={marker}

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
									source={{ url: user.user.ava_url }}
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
						{/* <Callout>
							<View
								style={{
									flexDirection: "column",
									width: 100,
									height: 50
								}}
							>
								{addressText &&
									<Text
										style={{
											marginLeft: 2,
											color: "black"
										}}
									>
										{addressText}
									</Text>
								}
							</View>
						</Callout> */}
					</Marker>
				}
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
			{addressText &&
				<View style={styles.bottomPinContainer}>
					<View style={styles.bottomPinNav}>
						<View
							style={{
								...styles.shadowBtn,
								shadowOpacity: Platform.OS == "ios" ? 0.25 : 0.5,
								width: '100%',
								backgroundColor: 'white'
							
							}}
						>
							<TouchableOpacity
								style={{
									alignSelf: "center",
									overflow: "hidden",
									padding: 15,
									backgroundColor: "white",
									borderRadius: 10,
									margin: 16,
									backgroundColor: colors.mainColor2,
									width: '90%',
									
								}}
								onPress={updateGroupAddress}
							>
								<Text
									color='white'
									style={styles.buttonTitle}
								>
									Confirm
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			}
			{addressText &&
				<View style={styles.sidePinContainer}>
					<View style={styles.sidePinNav}>
						<View
							style={{
								...styles.shadowBtn,
								shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
							}}
						>
							<IconButton
								icon={props => <MIcon name="arrow-back" {...props} />}
								color="#9CC7CA"
								// style={{
								// 	alignSelf: "center",
								// 	padding: 20,
								// 	backgroundColor: "white",
								// 	borderRadius: 10,
								// 	margin: 12,
								// }}
								onPress={() => navigation.goBack()}
							/>
						</View>

						<View style={{ marginLeft: 10, width: '75%' }}>
							<Text
								style={styles.pinHeaderText}
								numberOfLines={2}
							>
								{addressText}
							</Text>
						</View>

					</View>
				</View>
			}
		</View>
	);
};

export default PinOnMap;
