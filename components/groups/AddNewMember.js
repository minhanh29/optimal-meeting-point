import { View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer, IconButton } from '@react-native-material/core'
import { useTheme } from '@react-navigation/native';
import styles from "./styles"
import AIcon from "@expo/vector-icons/AntDesign";
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, doc, getDocs, query, where, documentId, addDoc, GeoPoint } from "firebase/firestore";
import { db, getGroupName } from "../../firebaseConfig"
import FIcon from "@expo/vector-icons/Feather";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { addNewMemberAsync, ADD_MEMBER_PENDING, ADD_MEMBER_REJECTED, ADD_MEMBER_SUCCESS, selectGroup, changeGroupStatus, GROUP_IDLE } from '../../redux/reducers/groupSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import { InstantSearch, connectRefinementList, connectHits } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";

const AddMemberFilter = connectRefinementList(({ items, refine, user_id }) => {
	useEffect(() => {
		refine(user_id);
	}, [user_id]);

	return <View></View>;
});


const AddNewMemberHits = connectHits(({hits, navigation}) => {
    const { colors } = useTheme();
	const [searchString, setSearchString] = useState("")
    const group = useSelector(selectGroup)
    const user = useSelector(selectUser)
    const [userList, setUserList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState([]);
    const [memberList, setMemberList] = useState([])
    const [groupData, setGroupData] = useState({})
    const [numMember, setNumMember] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        if (group.status === ADD_MEMBER_REJECTED) {
            Alert.alert(
                "Invite to Group",
                "Failed to invite member to group",
                [
                    {
                        text: "OK",
                    },
                ],
                { cancelable: true }
            )
            dispatch(changeGroupStatus(GROUP_IDLE))
        } if (group.status === ADD_MEMBER_SUCCESS) {
            Alert.alert(
                "Invite to Group",
                "Send group invitation successfully",
                [
                    {
                        text: "OK",
                    },
                ],
                { cancelable: true }
            )
            dispatch(changeGroupStatus(GROUP_IDLE))
        }
    }, [group.status])

    const verifyAndFetchData = async (groupId) => {
        try {
            const ans = await getGroupName(groupId)
            const group = ans.data()
            setGroupData({
                groupId,
                ...group,
            })

            // setStatus(SUCCESS)
        } catch (e) {
            // setStatus(ERROR)
            console.log("ERROR2")
        }
    }



    useEffect(() => {
        verifyAndFetchData(group.groupId)
    }, [])


    const fetchUserInfo = async () => {
        try {
			const memberIdSet = new Set(group.memberIds)
			console.log("Set ====", memberIdSet)
            const friendSnapshot = await getDocs(query(collection(db, "friend"), where("person1_id", "==", user.user.id)));
			const friendIdList = friendSnapshot.docs.map(doc => doc.data().person2_id)

			let myDocs = []
			for (let i = 0; i < friendIdList.length / 10.0; i++) {
				let snapshot = await getDocs(query(collection(db, "user"), where(documentId(), "in", friendIdList.slice(i, Math.min(i+10, friendIdList.length)))));

				myDocs = myDocs.concat(snapshot.docs)
			}

            const result = []
            myDocs.forEach(doc => {
				if (!memberIdSet.has(doc.id)) {
					result.push({
						id: doc.id,
						...doc.data()
					})
				}
            })
			result.sort((a, b) => a.name.localeCompare(b.name));
            setUserList(result)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchUserHits = (hits) => {
		const result = []
		hits.forEach(item => {
			if (item.name && item.ava_url && item.username) {
				result.push({
					id: item.person1_id,
					name: item.name,
					username: item.username,
					ava_url: item.ava_url,
				})
			}
		})

		setUserList(result)
    }

    useEffect(() => {
		if (searchString.trim() === "" ) {
			fetchUserInfo();
		} else {
			fetchUserHits(hits)
		}
    }, [hits, searchString]);

    const handleAdd = (user, index) => {
        setSelectedIndex(prev => {
            const isInclude = selectedIndex.includes(index)
            if (isInclude) {
                return selectedIndex.filter(item => item !== index)
            } else {
                return [...prev, index]
            }
        })

        setMemberList(prev => {
            const isInclude = memberList.includes(user)
            if (isInclude) {
                return memberList.filter(item => item !== user)
            } else {
                return [...prev, user]
            }
        })
    }

    const handleAddMember = async () => {
        try {
            const data = {
                group_id: groupData.groupId,
                memberIds: memberList.map(item => item.id),
                user_id: user.user.id,
            }
            dispatch(addNewMemberAsync(data))
        } catch (e) {
            console.log(e.message)
        }
    }


    return (
        <View>
            <Stack
                backgroundColor={colors.background}
                h="100%"
                w="100%"
                items="center"
                paddingTop={35}
            >
                <Spinner
                    visible={group.status === ADD_MEMBER_PENDING}
                    textContent={'Loading...'}
                    textStyle={{ color: "white" }}
                    cancelable={true}
                />
                <Stack w="80%" items="start">
                    <Text
                        style={styles.textInput}

                        color='black'
                    >
                        {groupData.group_name}
                    </Text>
                </Stack>
                <Stack
                    h="100%"
                    w="100%"
                    items="center"
                    spacing={25}
                >
					<SearchBox width="80%" searchBoxName="Search friends" setSearchString={setSearchString} />

                    <ScrollView style={styles.listContainer}>
                        <Stack w='100%' spacing={20}>
                            {userList.map((user, index) => {
                                return (
                                    <Box
                                        elevation={3}
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
                                                label={user.name}
                                                icon={props => <Icon name="account" {...props} />}
                                                image={user.ava_url ? { uri: user.ava_url } : null}
                                                imageStyle={{ borderRadius: 10 }}
                                            />
                                            <Stack
                                                style={{ marginLeft: 17 }}
                                                spacing={5}
                                                w="58%"
                                            >
                                                <Text style={styles.cardHeader} >
                                                    {user.name}
                                                </Text>
                                                <Text style={styles.infoContent} >
                                                    @{user.username}
                                                </Text>
                                            </Stack>

                                            <IconButton
                                                icon={props => <FIcon name={selectedIndex.includes(index) ? 'minus' : 'plus'} {...props} />}
                                                color="black"
                                                style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
                                                onPress={() => handleAdd(user, index)}
                                            />
                                        </Flex>
                                    </Box>
                                )
                            })}
                        </Stack>
                    </ScrollView>

                    <Spacer />
                    <Stack w='100%' items="center">
                        <Text style={styles.subContent}>Number of members: {selectedIndex.length}</Text>
                        <TouchableOpacity
                            style={{
                                ...styles.buttonContainer,
                                backgroundColor: colors.mainColor2
                            }}
                            onPress={handleAddMember}
                        >
                            <Text
                                style={styles.buttonTitle}
                                color="white"
                            >
                                Send invitation
                            </Text>
                        </TouchableOpacity>
                    </Stack>
                </Stack>
            </Stack>
        </View>
    )
})

const AddNewMember = ({ navigation }) => {
	const user = useSelector(selectUser);

	return (
	<InstantSearch searchClient={searchClient} indexName="friends">

			<AddMemberFilter user_id={user.user.id} attribute="person2_id" />
			<AddNewMemberHits navigation={navigation} />
	</InstantSearch>
	);
};
export default AddNewMember
