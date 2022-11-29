import React from 'react'
import { TextInput, StyleSheet, SafeAreaView } from 'react-native'

const MyTextInput = (props) => {
	return (
		<SafeAreaView style={{
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
		</SafeAreaView>
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
