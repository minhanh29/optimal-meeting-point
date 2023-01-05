import { ScrollView, View, TextInput } from "react-native";
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
import { InstantSearch, connectRefinementList, connectHits } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";

const FriendFilter = connectRefinementList(({ items, refine, user_id }) => {
	useEffect(() => {
		refine(user_id);
	}, [user_id]);

	return <View></View>;
});

const FriendHits = connectHits(({hits, navigation }) => {
	const { colors } = useTheme();
	const [searchString, setSearchString] = useState("")
	const { user } = useSelector(selectUser);
	const [userList, setUserList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchUserData = async (idList) => {
		console.log("IDlist", idList)
		try {
			let myDocs = []
			for (let i = 0; i < idList.length / 10.0; i++) {
				let snapshot = await getDocs(query(collection(db, "user"), where(documentId(), "in", idList.slice(i, Math.min(i+10, idList.length)))))

				myDocs = myDocs.concat(snapshot.docs)
			}

			const result = myDocs.map(doc => ({
				id: doc.id,
				...doc.data()
			}))
			result.sort((a, b) => a.name.localeCompare(b.name));
			setUserList(result)
		} catch (e) {
			console.log(e.message)
		}
		setLoading(false)
	}

	const fetchUserHits = async (hits) => {
		const data = hits.map(item => ({
			id: item.person1_id,
			ava_url: item.ava_url,
			name: item.name,
			username: item.username
		}))
		setUserList(data.filter(item => item.name && item.ava_url))
		setLoading(false)
	}

	useEffect(() => {
		if (searchString.trim() === "" ) {
			const unsub = onSnapshot(query(collection(db, "friend"), where("person1_id", "==", user.id)), (snapshot) => {
				fetchUserData(snapshot.docs.map(doc => doc.data().person2_id))
			})

			return () => unsub()
		} else {
			fetchUserHits(hits)
		}
	}, [hits, searchString])

	return (
	<Stack
		backgroundColor={colors.background}
		h="100%"
		w="100%"
		items="center"
		paddingTop={45}
		spacing={20}
	>
		<Flex w="80%" direction="row">
			<SearchBox width="90%" searchBoxName="Search friends" setSearchString={setSearchString} />
			<IconButton
				icon={props => <AIcon name="adduser" {...props} color="B4BABC" />}
				onPress={() => navigation.navigate("AddFriends")}
			/>
		</Flex>

		<ScrollView style={styles.listContainer}>
			<Spinner
				visible={loading}
				textContent={'Loading...'}
				textStyle={{ color: "white" }}
				cancelable={true}
			/>
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
});

const Friends = ({ navigation }) => {
	const user = useSelector(selectUser);
	const { colors } = useTheme();

	return (
	<InstantSearch searchClient={searchClient} indexName="friends">
		<FriendFilter user_id={user.user.id} attribute="person2_id" />
		<FriendHits navigation={navigation} />
	</InstantSearch>
	);
};
export default Friends;

