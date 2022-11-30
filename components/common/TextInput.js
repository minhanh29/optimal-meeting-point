import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { Box } from "@react-native-material/core";

const MyTextInput = (props) => {
	return (
		<Box style={{
			...styles.inputContainer,
			...props.style
			}} >
			<TextInput
				{...props}
				style={{
					...styles.input,
					...props.textStyle
				}}
			/>
		</Box>
	)
}

const styles = StyleSheet.create({
	inputContainer: {
		width: "100%",
		borderRadius: 15,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowColor: "black",
		backgroundColor: "white",
		padding: 12,
		paddingHorizontal: 15,
		elevation: 4,
	},
	input: {
		fontFamily: "Montserrat"
	}
})

export default MyTextInput
