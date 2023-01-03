import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer, IconButton } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import styles from "./styles"
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import { db } from "../../firebaseConfig"
import { collection, doc, getDocs, query, addDoc, documentId, where } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, USER_IDLE } from '../../redux/reducers/userSlice';
import { createGroupAsync, selectGroup, GROUP_CREATE_SUCCESS, GROUP_CREATE_PENDING, GROUP_CREATE_FAILED, GROUP_IDLE, changeGroupStatus } from '../../redux/reducers/groupSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import { InstantSearch, connectRefinementList, connectHits } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";

const CreateGroupFilter = connectRefinementList(({ items, refine, user_id }) => {
	useEffect(() => {
		refine(user_id);
	}, [user_id]);

	return <View></View>;
});

const CreateGroupHits = connectHits(({hits, navigation}) => {
    const { colors } = useTheme();
	const [searchString, setSearchString] = useState("")
    const [userList, setUserList] = useState([]);
    // const [iconBtn, setIconBtn]  = useState("plus");
    const [memberList, setMemberList] = useState([])
    const [groupName, setGroupName] = useState("")

    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const group = useSelector(selectGroup)
    const [selectedIndex, setSelectedIndex] = useState([]);



    const fetchUserInfo = async () => {
        try {
			const friendSnapshot = await getDocs(query(collection(db, "friend"), where("person1_id", "==", user.user.id)))
			const friendIds = friendSnapshot.docs.map(doc => doc.data().person2_id)
            const querySnapshot = await getDocs(query(collection(db, "user"), where(documentId(), "in", friendIds)));
            const result = []
            querySnapshot.forEach(doc => {
				if (doc.id !== user.user.id) {
					result.push({
						id: doc.id,
						...doc.data()
					})
				}
            })

            const doc = querySnapshot.docs[0]
            const data = doc.data()
            // setName(data.name)
            // setUsername(data.username)
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

    useEffect(() => {
        if(group.status === GROUP_CREATE_FAILED ){
            Alert.alert(
                "Created Group",
                "Failed to create group",
                [
                    {
                      text: "OK",
                    },
                ],
                { cancelable: true }
            )
            dispatch(changeGroupStatus(GROUP_IDLE))
        }if(group.status === GROUP_CREATE_SUCCESS){
            Alert.alert(
                "Created Group",
                "Your group has been created successfully",
                [
                    {
                      text: "OK",
                      onPress:() => navigation.goBack(),
                    },
                ],
                { cancelable: true }
            )
            dispatch(changeGroupStatus(GROUP_IDLE))
        }
    },[group.status])




    // Click + => include user to the memberList | click - => remove user from the the memberList
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


    const handleCreate = async () => {
        if (groupName === "") {
            return
        }

        try {
            const data = {
                group_name: groupName.trim(),
                location: '',
                user_id: user.user.id,
                user_location: user.user.address,
				memberIds: memberList.map(item => item.id)
            }
            dispatch(createGroupAsync(data))

        } catch (e) {
        }
    }

    return (
        <Stack
            backgroundColor={colors.background}
            h="100%"
            w="100%"
            items="center"
            paddingTop={35}
        >
            <Spinner
                visible={group.status === GROUP_CREATE_PENDING}
                textContent={'Loading...'}
                textStyle={{ color: "white" }}
                cancelable={true}
            />
            <Stack w="80%" items="start">
                <TextInput
                    style={styles.textInput}
                    placeholder='Your group name (optional)'
                    color='#B4BABC'
                    onChangeText={(newText) => setGroupName(newText)}
                />
            </Stack>
            <Stack
                h="100%"
                w="100%"
                items="center"
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
                    <Text style={styles.subContent}>Number of members: 2</Text>
                    <TouchableOpacity
                        style={{
                            ...styles.buttonContainer,
                            backgroundColor: colors.mainColor2
                        }}
                        onPress={() => handleCreate()}
                    >
                        <Text
                            style={styles.buttonTitle}
                            color="white"
                        >
                            Create Group
                        </Text>
                    </TouchableOpacity>
                </Stack>
            </Stack>
        </Stack>
    )
})

const CreateGroup = ({ navigation }) => {
	const user = useSelector(selectUser);

	return (
	<InstantSearch searchClient={searchClient} indexName="friends">

			<CreateGroupFilter user_id={user.user.id} attribute="person2_id" />
			<CreateGroupHits navigation={navigation} />
	</InstantSearch>
	);
};
export default CreateGroup
