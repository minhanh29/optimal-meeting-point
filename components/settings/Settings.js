import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Platform, Alert } from 'react-native'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import * as Location from 'expo-location';
import { db, updateUser } from "../../firebaseConfig"
import { onSnapshot, doc, GeoPoint } from "firebase/firestore";
import {
	logOutAsync,
	selectUser,
	changeLocation
} from "../../redux/reducers/userSlice"
import {
	changeEnterGroup
} from "../../redux/reducers/groupSlice"
import { useDispatch, useSelector } from "react-redux"

import styles from "./styles"
import {geoToDict} from '../common/Utils';

const Settings = ({ navigation }) => {
	const { colors } = useTheme();
	const [checkedLocation, setCheckedLocation] = useState(false);
	const [address, setAddress] = useState('Loading...');
	const [name, setName] = useState("Minh Anh");
	const [username, setUsername] = useState("minhanh");
	const [avatar, setAvatar] = useState(null);

	const dispatch = useDispatch()
	const { user } = useSelector(selectUser)

	useEffect(() => {
		checkIfLocationEnabled()
		if (user.id === "")
			return

		onSnapshot(doc(db, "user", user.id), (snapshot) => {
			const data = snapshot.data()
			setName(data.name)
			setUsername(data.username)
			setAvatar(data.ava_url)
			setCheckedLocation(data.gps_enabled)
			setAddress(data.address_text)
		})
	}, [user.id]);

	const checkIfLocationEnabled = async () => {
		try {
			let enabled = await Location.hasServicesEnabledAsync();

			if (!enabled) {
				Alert.alert(
					"Location Service not enabled",
					"Please enable your location services to continue",
					[{ text: "OK" }],
					{ cancelable: false }
				);
			}

			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
			  console.log('Location permission not granted!');
			  return;
			}

		} catch(e) {
			console.log(e)
		}
	};

	const handleLocationCheck = async () => {
		if (!checkedLocation) {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				return;
			}
		}
		setCheckedLocation(!checkedLocation)
	}

	const handleLogout = () => {
		dispatch(logOutAsync())
		navigation.navigate("Login")
	}

	const setUserLocation = async (data) => {
		const newData = {
			address: new GeoPoint(data.location.latitude, data.location.longitude),
			address_text: data.address_text
		}
		await updateUser(user.id, newData)
		dispatch(changeLocation({
			address: data.location,
			address_text: data.address_text
		}))
		// dispatch(changeEnterGroup({
		// 	enterGroup: false,
		// 	groupId: "",
		// }))
	}

	return (
		<Stack
			backgroundColor={colors.background}
			h="100%"
			w="100%"
			items="center"
			paddingTop={50}
			spacing={25}
		>
			<Box
				elevation={4}
				backgroundColor="white"
				style={styles.cardContainer}
			>
				<Flex
					w="100%"
					items="center"
					direction="row"
				>
					<Avatar
						label="Minh Anh"
						icon={props => <Icon name="account" {...props} />}
						image={avatar ? { uri: avatar } : null}
						imageStyle={{ borderRadius: 10 }}
					/>

					<Stack
						style={{marginLeft: 17}}
						spacing={5}
						w="100%"
					>
						<Text style={styles.cardHeader} >
							{name}
						</Text>
						<Text style={styles.infoContent} >
							@{username}
						</Text>
						<Text
							style={styles.infoContent}
							numberOfLines={1}
						>
							{address}
						</Text>
					</Stack>
				</Flex>
			</Box>

			<TouchableOpacity
				style={styles.cardContainer}
				onPress={() => navigation.navigate("UpdateProfile")}
			>
				<Text style={styles.cardHeader} >
					Update profile
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.cardContainer}
				onPress={() => navigation.navigate("ChangePassword")}
			>
				<Text style={styles.cardHeader} >
					Change password
				</Text>
			</TouchableOpacity>

			<Flex
				justify="between"
				items="center"
				direction="row"
				style={{
					...styles.cardContainer,
					paddingVertical: Platform.OS == "ios" ? 12 : 4,
				}}
			>
				<Text style={styles.cardHeader}>
					Your location
				</Text>
				<Switch
					style={Platform.OS == "ios" ? {
						transform: [{ scaleX: .8 }, { scaleY: .8 }],
					} : null}
					trackColor={{
						true: colors.mainColor2
					}}
					thumbColor="white"
					value={checkedLocation}
					onChange={handleLocationCheck}
				/>
			</Flex>

			<TouchableOpacity style={styles.cardContainer}
              onPress={() =>
                navigation.navigate("Address", {
                  setGeoLocation: setUserLocation,
                })
              }
			>
				<Text style={styles.cardHeader} >
					Edit your default location
				</Text>
			</TouchableOpacity>

			<Spacer />
			<TouchableOpacity
				style={{
					...styles.buttonContainer,
					backgroundColor: colors.mainColor2
				}}
				onPress={handleLogout}
			>
				<Text
					style={styles.buttonTitle}
					color="white"
				>
					Log Out
				</Text>
			</TouchableOpacity>
		</Stack>
	)
}

export default Settings
