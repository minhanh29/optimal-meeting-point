import React from 'react'
import { View } from 'react-native'
import { Avatar, Stack, Text, Flex } from "@react-native-material/core";
import CheckBox from 'expo-checkbox';
import styles from "./styles"

const Card = ({isChecked, handleCheckbox, id, title, content, ava}) => {
	return (
		<View
			style={styles.cardContainer}
		>
			<Flex
				direction="row"
				items="center"
			>
				<CheckBox
					disabled={false}
					value={isChecked}
					onValueChange={(newValue) => handleCheckbox(id)}
					color="#9ACDD0"
					style={{marginRight: 15}}
				/>
				<Avatar
					label={title}
					image={{ uri: ava}}
					imageStyle={{ borderRadius: 10 }}
					size={45}
				/>
				<Stack marginLeft={10} justify="center" >
					<Text style={styles.cardHeader} >
						{title}
					</Text>
					<Text style={styles.cardContent} >
						{content}
					</Text>
				</Stack>
			</Flex>
		</View>
	)
}

export default Card

