import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import {Avatar, Box, Stack, Text, Switch, Flex, Spacer, IconButton } from '@react-native-material/core'
import { useTheme } from '@react-navigation/native';
import styles from "./styles"
import AIcon from "@expo/vector-icons/AntDesign";
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, doc, getDocs, query, addDoc } from "firebase/firestore";
import { db, getGroupName } from "../../firebaseConfig"
import FIcon from "@expo/vector-icons/Feather";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
const AddNewMember = () => {
    const { colors } = useTheme();
    const [userList, setUserList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState([]);
    const [memberList, setMemberList] = useState([])
    const [groupData, setGroupData] = useState('')
    const user = useSelector(selectUser)
    console.log("GROUP DATA", groupData) // group_id
    console.log("MEMBERLIST", memberList)
    console.log("USERLIST", userList)

    //Mot lam cai useParam de lay cai group ID thi sua lai cho nay
    const groupID = "vwcofpwSCqh01WnAaqsZ"

    const verifyAndFetchData = async (groupId) => { // Mot lam xong thi cai groupId nay se la cai lay ra dc tu cai param
		try {
			const ans = await getGroupName(groupId)
            const group = ans.data()
            setGroupData({
                groupId,
                ...group
            })
            // setStatus(SUCCESS)
		} catch(e) {
			// setStatus(ERROR)
            console.log("ERROR2")
		}
	}

    useEffect(() => {
        verifyAndFetchData(groupID)
    },[]) // Mot lam thiet thi thay cai dieu kien nay [] thanh [groupID]

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
            setUserList(result)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleAdd = (user, index) => {
        setSelectedIndex(prev =>{
            const isInclude = selectedIndex.includes(index)
            if(isInclude){
                return selectedIndex.filter(item => item !== index)
            }else{
                return [...prev, index]
            }
        })
       
        setMemberList(prev => {
            const isInclude = memberList.includes(user)
            if(isInclude){
                return memberList.filter(item => item !== user)
            }else{
                return [...prev, user]
            }
        })
    }

    const handleSend = async() => {
        try{

            const data = {
                group_id: groupID,
                sender_id: user.user.id,
                receiver_id: memberList[0].id,
                status: 0,
                created_at: new Date(),
            }
            console.log("DATA", data)
        }catch(e){

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
                <Stack w="80%" items="start">
                    <Text
                        style={styles.textInput}
            
                        color='black'
                    >
                        Group Name
                    </Text>
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
                                                icon={props => <FIcon name={ selectedIndex.includes(index) ? 'minus' : 'plus'} {...props} />}
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
                            onPress={handleSend}
                        >
                            <Text
                                style={styles.buttonTitle}
                                color="white"
                            >
                                Save Update
                            </Text>
                        </TouchableOpacity>
                    </Stack>
                </Stack>
            </Stack>
        </View>
    )
}

export default AddNewMember