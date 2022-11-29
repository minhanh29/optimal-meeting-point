import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Platform, Alert } from 'react-native'
import { Avatar, Box, Button, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import * as Location from 'expo-location';
import { db } from "../../firebaseConfig"
import { collection, getDocs } from "firebase/firestore";

import styles from "./styles"
import ava from "../../images/naruto_ava.jpg"
import { getAddressFromGeopoint } from "../common/Utils"

const myhome = {
  latitude: 10.729567,
  longitude: 106.6930756
}

const Settings = ({ navigation }) => {
	const { colors } = useTheme();
	const [checkedLocation, setCheckedLocation] = useState(false);
	const [address, setAddress] = useState('Loading...');
	const [name, setName] = useState("Minh Anh");
	const [username, setUsername] = useState("minhanh");

	useEffect(() => {
		checkIfLocationEnabled();
		fetchUserInfo();
	}, []);

	const fetchUserInfo = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, "user"));
			const doc = querySnapshot.docs[0]
			const data = doc.data()
			setName(data.name)
			setUsername(data.username)
			let address = await getAddressFromGeopoint(data.address)
			setAddress(address)
		} catch(e) {
			console.log(e)
		}
	}

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
			} else {
				setCheckedLocation(enabled);
			}
		} catch(e) {
			console.log(e)
		}
	};

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
						image={ava}
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
					paddingVertical: 4
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
					onChange={() => setCheckedLocation(!checkedLocation)}
				/>
			</Flex>

			<TouchableOpacity style={styles.cardContainer} >
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
