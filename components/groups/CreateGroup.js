import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer, IconButton } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import styles from "./styles"
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import { db } from "../../firebaseConfig"
import { collection, doc, getDocs, query, addDoc } from "firebase/firestore";
const CreateGroup = () => {
    const { colors } = useTheme();
    const [avatar, setAvatar] = useState(null);
    const [userList, setUserList] = useState([]);
    // const [iconBtn, setIconBtn]  = useState("plus");
    const [memberList, setMemberList] = useState([])
    const [groupName, setGroupName] = useState("Group name")
    console.log("Here is member", memberList)
    console.log("Group", groupName)

    const createGroup = (data) => {
        return addDoc(collection(db, "group"), {
            ...data
        });
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
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);


    const handleAdd = (user) => {
        // if(iconBtn == 'plus')
        //     setIconBtn("minus");

        // else{
        //     setIconBtn("plus")
        // }

        setMemberList(memberList => ([
            ...memberList, user.name
        ]))
    }

    //Done 50% add to group db, doing groupNuser db
    const handleCreate = async () => {
        try {
            const data = {
                group_name: groupName.trim(),
                location: '',
            }

            await createGroup(data)
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
                paddingTop={35}
            >
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

                    <Stack w='80%' spacing={20}>
                        {userList.map((user, index) => {
                            return (
                                <Box
                                    elevation={4}
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
                                            image={avatar ? { uri: user.ava_url } : null}
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
                                            icon={props => <FIcon name={'plus'} {...props} />}
                                            color="black"
                                            style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
                                            onPress={() => handleAdd(user)}
                                        />
                                    </Flex>
                                </Box>
                            )
                        })}
                    </Stack>
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
        </View>
    )
}

export default CreateGroup