import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer, IconButton } from '@react-native-material/core'
import { useTheme } from '@react-navigation/native';
import styles from "./styles"
import AIcon from "@expo/vector-icons/AntDesign";
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, doc, getDocs, query, addDoc, onSnapshot, where } from "firebase/firestore";
import { db, getGroupName, getUserInfo } from "../../firebaseConfig"
import FIcon from "@expo/vector-icons/Feather";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import Icon from "@expo/vector-icons/Ionicons";
import {
  selectGroup,
} from "../../redux/reducers/groupSlice";


const GroupInfo = ({navigation}) => {
	const group = useSelector(selectGroup);
    const { colors } = useTheme();
    const [avatar, setAvatar] = useState(null);
    const [dataList, setDataList] = useState([])
    const [memberNameMap, setMemberNameMap] = useState({})
    // const groupID = "vwcofpwSCqh01WnAaqsZ" //useParam
    console.log("DataList", dataList)
    const user = useSelector(selectUser)
    console.log("MemberName", memberNameMap)

    const fetchMemberName = async (refList) => {
        const memberDict = { ...memberNameMap }
        const members = []
        try {
          for (let i = 0; i < refList.length; i++) {
            data = refList[i]
            if (!data.user_id in memberDict) {
              members.push(memberDict[data.user_id])
              continue

            }

            const res = await getUserInfo(data.user_id)


            memberDict[res.id] = {
              id: data.id,
              ...res.data()
            }

            members.push(memberDict[data.user_id])

          }

        } catch (e) { }
        setDataList(members)
        setMemberNameMap(memberDict)
      }

	useEffect(() => {
		const unsub = onSnapshot(query(collection(db, "groupNuser"), where("group_id", "==", group.groupId)), (snapshot) => {
		  const refList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
		  console.log(refList)
		  fetchMemberName(refList)
		})

		return () => unsub()
	}, [group.groupId]);

    return (
        <View>
            <Stack
                backgroundColor={colors.background}
                h="100%"
                w="100%"
                items="center"
                paddingTop={35}
            >
                <Flex w="80%" items="start" direction="row">
                    <Text
                        style={styles.textInput}

                        color='black'
                    >
						{group.groupInfo.group_name}
                    </Text>

                    <IconButton
                        icon={props => <FIcon name={'plus'} {...props} />}
                        color="black"
                        style={{ alignSelf: "center", padding: 20, backgroundColor: 'white', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
                        onPress = {() => navigation.navigate("AddNewMember")}
                    />
                </Flex>

                <ScrollView style={{ ...styles.listContainer, marginTop: 10 }}>
                    <Stack w='100%' spacing={20}>
                        {dataList.map((data, index) => {
                            return(
                                <Box
                            elevation={3}
                            backgroundColor="white"
                            style={styles.cardContainer}
                            w='100%'
                            // key={index}
                        >
                            <Flex
                                w="100%"
                                items="center"
                                direction="row"
                            >
                                <Avatar
                                    label={data.name}
                                    icon={props => <Icon name="account" {...props} />}
                                    image={data.ava_url ? { uri: data.ava_url } : null}
                                    imageStyle={{ borderRadius: 10 }}
                                />
                                <Stack
                                    style={{ marginLeft: 17 }}
                                    spacing={5}
                                    w="58%"
                                >
                                    <Text style={styles.cardHeader} >
                                        {data.name}
                                    </Text>
                                    <Text style={styles.infoContent} >
                                        @{data.username}
                                    </Text>
                                </Stack>
                            </Flex>
                        </Box>
                            )
                        })}
                    </Stack>
                </ScrollView>
            </Stack>
        </View>
    )
}

export default GroupInfo

