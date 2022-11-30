import React, { useState } from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { Box, Button, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import TextInput from "../common/TextInput"

import styles from "./styles"

const ChangePassword = () => {
	const { colors } = useTheme();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<Stack
			backgroundColor={colors.background}
			h="100%"
			w="100%"
			items="center"
			paddingTop={50}
			spacing={25}
		>
			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>Current password</Text>
				<TextInput
					value={currentPassword}
					onChangeText={setCurrentPassword}
					secureTextEntry={true}
				/>
			</Stack>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>New password</Text>
				<TextInput
					value={newPassword}
					onChangeText={setNewPassword}
					secureTextEntry={true}
				/>
			</Stack>

			<Stack w="80%" items="start" spacing={7}>
				<Text style={styles.text}>Confirm new password</Text>
				<TextInput
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry={true}
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

export default ChangePassword
