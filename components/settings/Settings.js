import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar, Box, Button, Stack, Text, Switch, Flex } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';

import styles from "./styles"
import ava from "../../images/naruto_ava.jpg"

const Settings = () => {
	const { colors } = useTheme();
	const [checkedLocation, setCheckedLocation] = useState(true);

	return (
		<Stack
			backgroundColor={colors.background}
			h="100%"
			w="100%"
			items="center"
			paddingTop={50}
			spacing={25}
		>
			<Box
				elevation={4}
				backgroundColor="white"
				style={styles.cardContainer}
			>
				<Flex
					w="100%"
					items="center"
					direction="row"
				>
					<Avatar
						label="Minh Anh"
						icon={props => <Icon name="account" {...props} />}
						image={ava}
						imageStyle={{ borderRadius: 10 }}
					/>
					<Stack
						style={{marginLeft: 17}}
						spacing={5}
					>
						<Text
							style={{ fontFamily: "Montserrat-Bold", fontSize: 15}}
						>
							Minh Anh
						</Text>
						<Text
							style={{ fontFamily: "Montserrat", fontSize: 10 }}
						>
							@minhanh
						</Text>
						<Text
							style={{ fontFamily: "Montserrat", fontSize: 10 }}
						>
							34, 5C Trung Son, Binh Chanh
						</Text>
					</Stack>
				</Flex>
			</Box>

			<TouchableOpacity
				style={styles.cardContainer}
			>
				<Text
					style={styles.cardHeader}
				>
					Update Profile
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.cardContainer}
			>
				<Text
					style={styles.cardHeader}
				>
					Change password
				</Text>
			</TouchableOpacity>

			<Box
				elevation={4}
				backgroundColor="white"
				style={styles.cardContainer}
			>
				<Flex
					w="100%"
					justify="between"
					items="center"
					direction="row"
				>
					<Text
						style={styles.cardHeader}
					>
						Your location
					</Text>
					<Switch
						style={{
							transform: [{ scaleX: .8 }, { scaleY: .8 }],
						}}
						trackColor={{
							true: colors.mainColor2
						}}
						value={checkedLocation}
						onChange={() => setCheckedLocation(!checkedLocation)}
					/>
				</Flex>
			</Box>

			<TouchableOpacity
				style={styles.cardContainer}
			>
				<Text
					style={styles.cardHeader}
				>
					Edit your default location
				</Text>
			</TouchableOpacity>

		</Stack>
	)
}

export default Settings
