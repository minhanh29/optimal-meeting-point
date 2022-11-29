import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { Avatar, Box, Button, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import TextInput from "../common/TextInput"
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"
import { getAddressFromGeopoint } from "../common/Utils"

import styles from "./styles"
import ava from "../../images/naruto_ava.jpg"

const UpdateProfile = () => {
	const { colors } = useTheme();

	const [image, setImage] = useState(null);
	const [name, setName] = useState("Minh Anh");
	const [username, setUsername] = useState("minhanh");

	useEffect(() => {
		fetchUserInfo()
	}, [])

	const fetchUserInfo = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, "user"));
			const doc = querySnapshot.docs[0]
			const data = doc.data()
			setName(data.name)
			setUsername(data.username)
		} catch(e) {
			console.log(e)
		}
	}

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
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
			<TouchableOpacity
				elevation={4}
				backgroundColor="white"
				style={styles.cardContainer}
				onPress={pickImage}
			>
				<Flex
					w="100%"
					items="center"
					direction="row"
				>
					<Avatar
						label="Minh Anh"
						icon={props => <Icon name="account" {...props} />}
						image={image ? { uri: image } : null}
						imageStyle={{ borderRadius: 10 }}
					/>

					<Flex
						w="100%"
						items="center"
						direction="row"
						marginLeft={20}
					>
						<MaterialIcons
							name="file-upload"
							size={29}
							color={colors.mainColor1}
						/>
						<Text style={{
							...styles.text,
							fontSize: 13
						}}>Upload Photo</Text>
					</Flex>
				</Flex>
			</TouchableOpacity>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>Name</Text>
				<TextInput
					value={name}
					onChangeText={setName}
				/>
			</Stack>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>Username</Text>
				<TextInput
					value={username}
					onChangeText={setUsername}
				/>
			</Stack>

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
					Save
				</Text>
			</TouchableOpacity>
		</Stack>
	)
}

export default UpdateProfile
