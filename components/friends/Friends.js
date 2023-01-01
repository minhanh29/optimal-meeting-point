import { ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Box, Stack, Icon, Text, Flex, IconButton } from "@react-native-material/core";
import { db } from "../../firebaseConfig"
import { onSnapshot, collection, getDocs, query, where, documentId } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
import styles from "./styles";
import { selectUser } from "../../redux/reducers/userSlice";
import Spinner from 'react-native-loading-spinner-overlay';

const Friends = ({navigation}) => {
	const { colors } = useTheme();
	const { user } = useSelector(selectUser);
	const [userList, setUserList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchUserData = async (idList) => {
		console.log("IDlist", id)
		try {
			const snapshot = await getDocs(query(collection(db, "user"), where(documentId(), "in", idList)))
			setUserList(snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			})))
		} catch (e) {
			console.log(e.message)
		}
		setLoading(false)
	}

	useEffect(() => {
		setLoading(true)
		onSnapshot(query(collection(db, "friend"), where("person1_id", "==", user.id)), (snapshot) => {
			fetchUserData(snapshot.docs.map(doc => doc.data().person2_id))
		})
	}, [])

	return (
		<Stack
			backgroundColor={colors.background}
			h="100%"
			w="100%"
			items="center"
			paddingTop={45}
			spacing={20}
		>
			<Spinner
				visible={loading}
				textContent={'Loading...'}
				textStyle={{ color: "white" }}
				cancelable={true}
			/>
			<Flex w="80%" direction="row">
				<Flex w="90%" style={styles.searchHolder} direction="row">
					<AIcon name="search1" style={styles.iconImg} color="B4BABC" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search friends"
						color="#B4BABC"
					/>
				</Flex>
				<IconButton
					icon={props => <AIcon name="adduser" {...props} color="B4BABC" />}
					onPress={() => navigation.navigate("AddFriends")}
				/>
			</Flex>

			<ScrollView style={styles.listContainer}>
				<Stack w="100%" spacing={20} >
					{userList.map((item, index) => {
						return (
							<Box elevation ={3}
							backgroundColor="white"
							style={styles.cardContainer}
							w='100%'
							key={index}
							>
								<Flex
								w="100%"
								items="center"
								direction="row"
								>
									<Avatar
									label={item.name}
									icon={props => <Icon name="account" {...props} />}
									image={item.ava_url ? {uri: item.ava_url} : null}
									imageStyle={{borderRadius: 10}}
									/>
								<Stack
								style ={{marginLeft:17}}
								spacing={5}
								w="58%"
								>
									<Text style={styles.cardHeader}>
										{item.name}
									</Text>
									<Text style={styles.infoContent}>
										@{item.username}
									</Text>
									</Stack>
								</Flex>
							</Box>
						)
					})}
				</Stack>
			</ScrollView>
		</Stack>
	);
};

export default Friends;

