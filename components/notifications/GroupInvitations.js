import React, { useState } from 'react'
import { FlatList, View, TouchableOpacity, Animated } from 'react-native'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import CheckBox from 'expo-checkbox';

import Card from "./Card"
import styles from "./styles"

const arr = [0, 1, 2, 3, 4]
const DATA = [
  {
    id: 0,
    title: 'First Item',
  },
  {
    id: 1,
    title: 'Second Item',
  },
  {
    id: 2,
    title: 'Third Item',
  },
  {
    id: 3,
    title: 'Third Item',
  },
  {
    id: 4,
    title: 'Third Item',
  },
  {
    id: 5,
    title: 'Third Item',
  },
];

const GroupInvitations = () => {
	const [selectAll, setSelectAll] = useState(false)
	const [checkedBoxes, setCheckedBoxes] = useState([])

	const handleCheckbox = (id) => {
		setCheckedBoxes(checkedBoxes.includes(id) ? checkedBoxes.filter(i => i != id) : [...checkedBoxes, id])
	}

	const handleSelectAll = (value) => {
		setSelectAll(value)
		if (value) {
			setCheckedBoxes(DATA.map(item => item.id))
		} else {
			setCheckedBoxes([])
		}
	}

	return (
		<Stack w="100%" spacing={10} marginTop={20} justify="between">
			<Flex direction="row">
				<CheckBox
					disabled={false}
					value={selectAll}
					onValueChange={(value) => handleSelectAll(value)}
					color="#9ACDD0"
					style={{marginRight: 10, marginLeft: 17}}
				/>
				<Text style={{fontFamily: "Montserrat-Bold", fontSize: 12}}>Select All</Text>
			</Flex>
			<FlatList
				data={DATA}
				renderItem={({item}) => <Card
					isChecked={checkedBoxes.includes(item.id)}
					handleCheckbox={handleCheckbox}
					id={item.id}
					title={item.title}
					content="@minhanh invites you to group BITS"
				/>}
				keyExtractor={item => item.id}
			/>
		</Stack>
	)
}

export default GroupInvitations

