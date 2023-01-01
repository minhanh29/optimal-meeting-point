import React, { useState, useEffect } from 'react'
import { FlatList, View, TouchableOpacity, Animated, Alert } from 'react-native'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import { db } from "../../firebaseConfig"
import { doc, setDoc, addDoc, onSnapshot, query, collection, where, getDoc, GeoPoint, deleteDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux"
import {
    selectUser,
} from "../../redux/reducers/userSlice"
import CheckBox from 'expo-checkbox';
import Spinner from 'react-native-loading-spinner-overlay';

import Card from "./Card"
import styles from "./styles"
import { async } from '@firebase/util';
import { deleteRequestAsync } from '../../redux/reducers/userSlice';

const STATUS_PENDING = 0;
const STATUS_ACCEPTED = 1;
const STATUS_REJECTED = 2;

const FriendRequests = () => {
	const { colors } = useTheme();

	const [selectAll, setSelectAll] = useState(false)
	const [processing, setProcessing] = useState(false)
	const [loaded, setLoaded] = useState(false)
	const [data, setData] = useState([])
	const [checkedBoxes, setCheckedBoxes] = useState([])
	const [userDict, setUserDict] = useState({})
	// const [friendDict, setFriendDict] = useState({})
    const dispatch = useDispatch()

	const {user} = useSelector(selectUser)

	useEffect(() => {
		if (user.id !== "") {
			onSnapshot(query(collection(db, "friend_request"), where("receiver_id", "==", user.id), where("status", "==", STATUS_PENDING)), (snapshot) => {
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
			const userData = await fetchUserData(refList)
			for (let i = 0; i < refList.length; i++) {
				let sData = userData[refList[i].sender_id]

				result.push({
					id: refList[i].id,
					senderName: sData.name,
					senderUsername:sData.username,
					senderAva: sData.ava_url,
					...refList[i]
				})
			}
		} catch(e) {
			console.log(e.message)
		}
		setData(result)
		setLoaded(true)
	}

	const fetchUserData = async (refList) => {
		const userData = {...userDict}

		for (let i=0; i<refList.length; i++) {
			try {
				let id = refList[i].sender_id
				if (id in userData) {
					continue
				}

				const data = await getDoc(doc(db, "user", id))
				userData[id] = data.data()
			} catch(e) {
				console.log(e.message)
			}
		}
		setUserDict(userData)

		return userData
	}

	const handleCheckbox = (id) => {
		setCheckedBoxes(checkedBoxes.includes(id) ? checkedBoxes.filter(i => i != id) : [...checkedBoxes,id])
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
		setProcessing(true)
		let dataClone = data.map(item => ({
			id: item.id,
			sender_id: item.sender_id
		}))

		for (let i = 0; i<checkedBoxes.length; i++) {
			try {
				//update request status
				console.log("========================= start")
				await setDoc(doc(db, "friend_request", checkedBoxes[i]), {
					status
				}, {merge: true})

				if (status === STATUS_ACCEPTED) {
					for (let j=0; j<dataClone.length; j++) {
						if (dataClone[j].id !== checkedBoxes[i])
						continue

						//add friend 1
						await addDoc(collection(db, "friend"), {
							person1_id: dataClone[j].sender_id,
							person2_id: user.id,
						})
						await addDoc(collection(db, "friend"), {
							person1_id: user.id,
							person2_id: dataClone[j].sender_id,
						})
						break
					}
				} else if (status === STATUS_REJECTED) {
					console.log("test================")
					handleDeleteRequest(checkedBoxes[i])
				}
			} catch (e) {
				showErrorMessage(e.message)
				setProcessing(false)
				console.log(e.message)
			}
		}
		setCheckedBoxes([])
		setProcessing(false)
		if (status == STATUS_ACCEPTED) {
			Alert.alert(
				"Accept Success",
				"You have became friend",
				[{ text: "OK"}],
				{cancelable:true}
			)
		}
	}

	const handleDeleteRequest = (request_id) => {
		console.log("ID", request_id)
		dispatch(deleteRequestAsync(request_id))
	}

	return (
		<Stack h="100%" overflow="visible">
			<Spinner
				visible={!loaded || processing}
				textContent={processing ? 'Processing...':'Loading...'}
				textStyle={{color: "white"}}
				cancelable={true}
			/>
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
					data={data}
					renderItem={({item}) => <Card
						isChecked={checkedBoxes.includes(item.id)}
						handleCheckbox={() => handleCheckbox(item.id)}
						id={item.id}
						title={item.senderName}
						content={`@${item.senderUsername} sent you a friend request`}
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

export default FriendRequests


