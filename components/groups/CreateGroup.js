import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer, IconButton } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import styles from "./styles"
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import { db } from "../../firebaseConfig"
import { collection, doc, getDocs, query, addDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, USER_IDLE } from '../../redux/reducers/userSlice';
import { createGroupAsync, selectGroup, GROUP_CREATE_SUCCESS, GROUP_CREATE_PENDING, GROUP_CREATE_FAILED, GROUP_IDLE, changeGroupStatus } from '../../redux/reducers/groupSlice';
import Spinner from 'react-native-loading-spinner-overlay';

const CreateGroup = ({navigation}) => {
    const { colors } = useTheme();
    const [avatar, setAvatar] = useState(null);
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
            const querySnapshot = await getDocs(collection(db, "user"));
            const result = []
            querySnapshot.forEach(doc => {
                result.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            const doc = querySnapshot.docs[0]
            const data = doc.data()
            // setName(data.name)
            // setUsername(data.username)
            setAvatar(data.ava_url)
            setUserList(result)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

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
                      onPress: () => navigation.navigate("Groups"),
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
                spacing={25}
            >

                <Flex direction='row' w='80%' style={styles.searchHolder}>
                    <AIcon name="search1" style={styles.iconImg} color='B4BABC' />
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search friend'
                        color='#B4BABC'
                    />
                </Flex>

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
}

export default CreateGroup
