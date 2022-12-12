import React, { useState, useEffect } from 'react'
import { TouchableOpacity, TextInput, Alert } from 'react-native'
import { Avatar, Stack, Text, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { getDoc, doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
} from "../../redux/reducers/userSlice"
import { db, updateUser, uploadFile } from "../../firebaseConfig"
import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles"

const UpdateProfile = () => {
	const { colors } = useTheme();
	const { user } = useSelector(selectUser)

	const [loaded, setLoaded] = useState(false);
	const [avatar, setAvatar] = useState(null);
	const [hasAvaChanged, setHasAvaChanged] = useState(false);
	const [name, setName] = useState("Minh Anh");
	const [username, setUsername] = useState("minhanh");

	useEffect(() => {
		fetchUserInfo()
	}, [])

	const fetchUserInfo = async () => {
		if (user.id === "")
			return

		try {
			const myDoc = await getDoc(doc(db, "user", user.id));
			const data = myDoc.data()
			setName(data.name)
			setUsername(data.username)
			setAvatar(data.ava_url)
			setLoaded(true)
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
			console.log(result.assets[0])
			if (result.assets[0].fileSize > 1000000) {
				Alert.alert(
					"Error",
					"File size too large",
					[{ text: "OK" }],
					{ cancelable: true }
				);
				return
			}

			setAvatar(result.assets[0].uri);
			setHasAvaChanged(true)
		}
	};

	const handleSave = async () => {
		if (user.id === "")
			return

		setLoaded(false)
		let title = "Update Success"
		let message = "Your profile is updated successfully!";

		try {
			let ava_url = avatar
			if (hasAvaChanged && avatar) {
				const filename = avatar.substring(avatar.lastIndexOf('/') + 1);
				const res = await uploadFile("avatar", avatar, filename)

				if (res.success)
					ava_url = res.mess
				else
					throw Error(res.mess)
			}

			await updateUser(user.id, {
				name, ava_url
			})
		} catch (e) {
			title = "Error"
			message = e.message
			console.log(e.message)
		}
		setLoaded(true)
		console.log("LOADED", loaded)
		Alert.alert(
			title,
			message,
			[{ text: "OK" }],
			{ cancelable: true }
		);
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
			<Spinner
				visible={!loaded}
				textContent={'Loading...'}
				textStyle={{color: "white"}}
				cancelable={true}
			/>

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
						image={avatar ? { uri: avatar } : null}
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
					style={styles.textInput}
				/>
			</Stack>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>Username</Text>
				<Text style={styles.textContent}>{username}</Text>
			</Stack>

			<Spacer />
			<TouchableOpacity
				style={{
					...styles.buttonContainer,
					backgroundColor: colors.mainColor2
				}}
				onPress={handleSave}
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
