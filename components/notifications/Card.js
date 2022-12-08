import React from 'react'
import { View } from 'react-native'
import { Avatar, Stack, Text, Flex } from "@react-native-material/core";
import CheckBox from 'expo-checkbox';
import styles from "./styles"

const Card = ({isChecked, handleCheckbox, id, title, content}) => {
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
					style={{marginRight: 10}}
				/>
				<Avatar
					label="Minh Anh"
					image={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTthtqEBdvBMFFn24X_A0l2nOf2lOIVZWPeeyzkm1QArnS7z_Kb8PPs9DHc5WIoSXQbWWM&usqp=CAU" }}
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

