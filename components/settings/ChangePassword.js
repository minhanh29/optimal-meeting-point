import React, { useState, useEffect } from 'react'
import { TouchableOpacity, TextInput, Alert } from 'react-native'
import { Stack, Text, Spacer } from "@react-native-material/core";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser, changePasswordStatus, changePasswordAsync,
	USER_IDLE, USER_CHANGING_FAILED, USER_CHANGING_SUCCESS, USER_CHANGING_PENDING
} from "../../redux/reducers/userSlice"
import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles"

const ChangePassword = () => {
	const { colors } = useTheme();
	const { user, passwordInfoStatus, errorMessage } = useSelector(selectUser)
	const dispatch = useDispatch()

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		if (passwordInfoStatus === USER_CHANGING_FAILED) {
			Alert.alert(
				'Error',
				errorMessage,
				[{ text: "OK" }],
				{ cancelable: true }
			);
			dispatch(changePasswordStatus(USER_IDLE))
		} if (passwordInfoStatus === USER_CHANGING_SUCCESS) {
			Alert.alert(
				'Password Updated',
				"Your password is updated successfully!",
				[{ text: "OK" }],
				{ cancelable: true }
			);
			dispatch(changePasswordStatus(USER_IDLE))
		}
	}, [passwordInfoStatus])

	const handleSave = () => {
		if (newPassword !== confirmPassword) {
			Alert.alert(
				'Error',
				"Confirmation password does not match",
				[{ text: "OK" }],
				{ cancelable: true }
			);
			return
		}

		dispatch(changePasswordAsync({
			username: user.username,
			currentPassword,
			newPassword
		}))
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
				visible={passwordInfoStatus === USER_CHANGING_PENDING}
				textContent={'Updating...'}
				textStyle={{color: "white"}}
				cancelable={true}
			/>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>Current password</Text>
				<TextInput
					value={currentPassword}
					onChangeText={setCurrentPassword}
					secureTextEntry={true}
					style={styles.textInput}
				/>
			</Stack>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>New password</Text>
				<TextInput
					value={newPassword}
					onChangeText={setNewPassword}
					secureTextEntry={true}
					style={styles.textInput}
				/>
			</Stack>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>Confirm new password</Text>
				<TextInput
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry={true}
					style={styles.textInput}
				/>
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

export default ChangePassword

