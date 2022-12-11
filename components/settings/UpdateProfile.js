import React, { useState, useEffect } from 'react'
import { TouchableOpacity, TextInput } from 'react-native'
import { Avatar, Stack, Text, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
} from "../../redux/reducers/userSlice"
import { db } from "../../firebaseConfig"

import styles from "./styles"

const UpdateProfile = () => {
	const { colors } = useTheme();
	const { user } = useSelector(selectUser)

	const [avatar, setAvatar] = useState(null);
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
			setAvatar(result.assets[0].uri);
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
				<TextInput
					value={username}
					onChangeText={setUsername}
					style={styles.textInput}
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
