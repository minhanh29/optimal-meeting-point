import React from 'react'
import { Box } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';

import styles from "./styles"

const Settings = () => {
	const { colors } = useTheme();
	console.log(colors)

	return (
		<Box
			backgroundColor={colors.background}
			h="100%"
		>
		</Box>
	)
}

export default Settings
