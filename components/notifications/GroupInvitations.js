import React, { useState, useEffect } from 'react'
import { FlatList, View, TouchableOpacity, Animated, Alert } from 'react-native'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import { db } from "../../firebaseConfig"
import { doc, setDoc, addDoc, onSnapshot, query, collection, where, getDoc, GeoPoint } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
} from "../../redux/reducers/userSlice"
import CheckBox from 'expo-checkbox';
import Spinner from 'react-native-loading-spinner-overlay';

import Card from "./Card"
import styles from "./styles"

const STATUS_PENDING = 0;
const STATUS_ACCEPTED = 1;
const STATUS_REJECTED = 2;

const GroupInvitations = () => {
	const { colors } = useTheme();

	const [selectAll, setSelectAll] = useState(false)
	const [loaded, setLoaded] = useState(false)
	const [groupDict, setGroupDict] = useState({})
	const [userDict, setUserDict] = useState({})
	const [data, setData] = useState([])
	const [checkedBoxes, setCheckedBoxes] = useState([])

	const { user } = useSelector(selectUser)

	useEffect(() => {
		if (user.id !== "") {
			onSnapshot(query(collection(db, "group_invitation"), where("receiver_id", "==", user.id), where("status", "==", STATUS_PENDING)), (snapshot) => {
				const refList = snapshot.docs.map(doc => ({
					...doc.data(),
					id: doc.id
				}))
				fetchData(refList)
			})
		} else {
			setLoaded(true)
		}
	}, [])

	const fetchData = async (refList) => {
		const result = []
		try {
			const groupData = await fetchGroupData(refList)
			const userData = await fetchUsersData(refList)
			for (let i = 0; i < refList.length; i++) {
				let gData = groupData[refList[i].group_id]
				let sData = userData[refList[i].sender_id]
				result.push({
					id: refList[i].id,
					senderName: sData.name,
					senderUsername: sData.username,
					senderAva: sData.ava_url,
					groupName: gData.group_name,
					...refList[i]
				})
			}
		} catch (e) {
			console.log(e.message)
		}

		setData(result)
		setLoaded(true)
	}

	const fetchGroupData = async (refList) => {
		const groupData = {...groupDict}
		for (let i = 0; i < refList.length; i++) {
			try {
				let id = refList[i].group_id
				if (id in groupData) {
					continue
				}

				const data = await getDoc(doc(db, "group", id))
				groupData[id] = data.data()
			} catch (e) {
				console.log(e.message)
			}
		}

		setGroupDict(groupData)
		return groupData
	}

	const fetchUsersData = async (refList) => {
		const userData = {...userDict}
		for (let i = 0; i < refList.length; i++) {
			try {
				let id = refList[i].sender_id
				if (id in userData) {
					continue
				}

				const data = await getDoc(doc(db, "user", id))
				userData[id] = data.data()
			} catch (e) {
				console.log(e.message)
			}
		}

		setUserDict(userData)
		return userData
	}

	const handleCheckbox = (id) => {
		setCheckedBoxes(checkedBoxes.includes(id) ? checkedBoxes.filter(i => i != id) : [...checkedBoxes, id])
	}

	const handleSelectAll = (value) => {
		setSelectAll(value)
		if (value) {
			setCheckedBoxes(data.map(item => item.id))
		} else {
			setCheckedBoxes([])
		}
	}

	const showErrorMessage = (message) => {
		Alert.alert(
			"Error",
			message,
			[{ text: "OK" }],
			{ cancelable: true }
		);
	}

	const changeStatus = async (status) => {
		let dataClone = data.map(item => ({
			id: item.id,
			group_id: item.group_id
		}))
		for (let i = 0; i < checkedBoxes.length; i++) {
			try {
				// update invitation status
				await setDoc(doc(db, "group_invitation", checkedBoxes[i]), {
					status
				}, { merge: true })

				if (status === STATUS_ACCEPTED) {
					for (let j = 0; j < dataClone.length; j++) {
						if (dataClone[j].id !== checkedBoxes[i])
							continue

						// add user to group
						await addDoc(collection(db, "groupNuser"), {
							group_address: new GeoPoint(user.address.latitude, user.address.longitude),
							group_id: dataClone[j].group_id,
							role: "member",
							user_id: user.id,
						})
						break
					}
				}
			} catch (e) {
				showErrorMessage(e.message)
			}
		}

		setCheckedBoxes([])
	}

	return (
		<Stack h="100%" overflow="visible">
			<Stack w="100%" spacing={10} marginTop={20} justify="between">
				<Spinner
					visible={!loaded}
					textContent='Loading...'
					textStyle={{color: "white"}}
					cancelable={true}
				/>
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
					data={data}
					renderItem={({item}) => <Card
						isChecked={checkedBoxes.includes(item.id)}
						handleCheckbox={() => handleCheckbox(item.id)}
						id={item.id}
						title={item.senderName}
						content={`@${item.senderUsername} invites you to group ${item.groupName}`}
						ava={item.senderAva}
					/>}
					keyExtractor={item => item.id}
				/>
			</Stack>

			<Spacer />
			<Flex
				direction="row"
				justify="between"
				w="100%"
				overflow="visible"
			>
				<TouchableOpacity
					style={{
						...styles.buttonContainer,
						backgroundColor: colors.mainColor1,
						width: "45%"
					}}
					onPress={() => changeStatus(STATUS_ACCEPTED)}
				>
					<Text style={styles.buttonTitle} color="white">
						Accept
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						...styles.buttonContainer,
						backgroundColor: colors.mainColor2,
						width: "45%"
					}}
					onPress={() => changeStatus(STATUS_REJECTED)}
				>
					<Text style={styles.buttonTitle} color="white">
						Decline
					</Text>
				</TouchableOpacity>
			</Flex>
		</Stack>
	)
}

export default GroupInvitations

