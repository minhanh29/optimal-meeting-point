import { StyleSheet, ScrollView, View, Button, TextInput } from "react-native";
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { Avatar, Box, Stack, Icon, Text, Flex, Spacer, IconButton } from "@react-native-material/core";
import { createFriendRequest, db } from "../../firebaseConfig"
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
// import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialIcons";
import styles from "./styles";
import { selectUser } from '../../redux/reducers/userSlice';
import { useState } from "react";
import { addFriendAsync } from "../../redux/reducers/userSlice";
import { async } from "@firebase/util";

const AddFriends = ({navigation}) => {

    const {colors} = useTheme();
    const [userList, setUserList] = useState([]);
    const [friendList , setFriendList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState([]);
    const user = useSelector(selectUser);
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch()


    const fetchFriendInfo = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "friend"));
            const result = []
            querySnapshot.forEach(doc => {
                result.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setFriendList(result)
            console
        } catch (e) {
            console.log(e)
        }
    }

    const fetchRequestInfo = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "friend_request"));
            const result = []
            querySnapshot.forEach(doc => {
                result.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setRequestList(result)
        } catch (e) {
            console.log(e)
        }
    }

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
            setUserList(temp => {
                if (user.user.id == friendList.person1_id || user.user.id == requestList.sender_id) {
                    const isIncludeFriend = userList.includes(friendList.person2_id)
                    const isIncludeRequest = userList.includes(requestList.receiver_id)
                    if (isIncludeFriend || isIncludeRequest) {
                        return userList.filter(item => item !== friendList.person2_id &&
                                item !== user.user.id && item !== requestList.receiver_id)
                    } else {
                        return [...temp]
                    }
                } else {
                    return [...temp]
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUserInfo();
        fetchFriendInfo();
        fetchRequestInfo();
    }, []);

    const handleAdd = (receiver, index) => {
        user = useSelector(selectUser)

        setSelectedIndex(prev => {
            const isInclude = selectedIndex.includes(index)
            if (isInclude) {
                return selectedIndex.filter(item => item !== index)
            } else {
                return [...prev, index]
            }
        })

        // sendRequest()
        try {
            const data = {
                user_id: user.user.id,
                receiver_id: receiver.id
            }
            console.log(data)
            dispatch(addFriendAsync(data))
        } catch (e) {
            console.log(e)
        }

    }


    return (
        <View>
            <Stack 
            backgroundColor={colors.background}
            h="100%"
            w="100%"
            items="center"
            paddingTop={40}
            >
                <Stack h="100%"
                    w="100%"
                    items="center"
                    spacing={20}>

                    <Flex w="80%" style={styles.searchHolder} direction="row">
                        <AIcon name="search1" style={styles.iconImg} color='B4BABC'/>
                        <TextInput
                        style={styles.searchInput}
                        placeholder='Search friends'
                        color='#B4BABC'
                        />
                    </Flex>
                
                    <ScrollView style={styles.listContainer}>
                        <Stack w="100%" spacing={20} >
                            {userList.map((user, index) => {
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
                                            label={user.name}
                                            icon={props => <Icon name="account" {...props} />}
                                            image={avatar ? {uri: user.ava_url} : null}
                                            imageStyle={{borderRadius: 10}}
                                            />
                                        <Stack 
                                        style ={{marginLeft:17}}
                                        spacing={5}
                                        w="58%"
                                        >
                                            <Text style={styles.cardHeader}>
                                                {user.name}
                                            </Text>
                                            <Text style={styles.infoContent}>
                                                @{user.username}
                                            </Text>
                                            </Stack>
                                            <IconButton
                                                icon={props => <FIcon name={selectedIndex.includes(index) ? 'check' : 'plus'} {...props} />}
                                                color = "black"
                                                style={{alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius:10, color: '#9ACDD0', marginRight: 20}}
                                                onPress={() => handleAdd(user, index)}
                                                />
                                        </Flex>
                                    </Box>
                                )
                            })}
                        </Stack>
                    </ScrollView>
                </Stack>
                
        </Stack>
    </View>
    )
}

export default AddFriends;