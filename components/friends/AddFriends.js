import { StyleSheet, ScrollView, View, Button, TextInput } from "react-native";
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { Avatar, Box, Stack, Icon, Text, Flex, Spacer, IconButton } from "@react-native-material/core";
import { createFriendRequest, db } from "../../firebaseConfig"
import { collection, getDocs, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import styles from "./styles";
import { selectUser } from '../../redux/reducers/userSlice';
import { useState } from "react";
import { addFriendAsync } from "../../redux/reducers/userSlice";
import Spinner from 'react-native-loading-spinner-overlay';

const AddFriends = ({navigation}) => {

    const {colors} = useTheme();
    const [userList, setUserList] = useState([]);
    // const [friendList , setFriendList] = useState([]);
    // const [requestList, setRequestList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(selectUser);
    const dispatch = useDispatch()

    const fetchUserInfo = async () => {
		setLoading(true)
        try {
            const friendSnapshot = await getDocs(query(collection(db, "friend"), where("person1_id", "==", user.user.id)));
			const friendSet = new Set(friendSnapshot.docs.map(doc => doc.data().person2_id))
			// console.log("Friend", friendSet)

            const requestSnapshot = await getDocs(query(collection(db, "friend_request"), where("sender_id", "==", user.user.id), where("status", "==", 0)));
            const requestSet = new Set(requestSnapshot.docs.map(doc => doc.data().receiver_id))
            // console.log("Request", requestSet)

            const querySnapshot = await getDocs(collection(db, "user"));
            const result = []
            querySnapshot.forEach(doc => {
				console.log(doc.id, doc.data().name)
                if (doc.id !== user.user.id && !friendSet.has(doc.id) && !requestSet.has(doc.id)) {
                    result.push({
                        id: doc.id,
                        ...doc.data()
                    })
                }
            })

            setUserList(result)

        } catch (e) {
            console.log(e)
        }
		setLoading(false)
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleAdd = (receiver, index) => {


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
            paddingTop={45}
            >
				<Spinner
					visible={loading}
					textContent={'Loading...'}
					textStyle={{ color: "white" }}
					cancelable={true}
				/>
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
                                            <IconButton
                                                icon={props => <FIcon name={selectedIndex.includes(index) ? 'check' : 'plus'} {...props} />}
                                                color = "black"
                                                style={{alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius:10, color: '#9ACDD0', marginRight: 20}}
                                                onPress={() => handleAdd(item, index)}
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
