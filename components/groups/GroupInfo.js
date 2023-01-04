import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Avatar, Box, Stack, Badge, Text, Switch, Flex, Spacer, IconButton } from '@react-native-material/core'
import { useTheme } from '@react-navigation/native';
import styles from "./styles"
import AIcon from "@expo/vector-icons/AntDesign";
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, doc, getDocs, query, addDoc, onSnapshot, where } from "firebase/firestore";
import { db, getGroupName, getUserInfo } from "../../firebaseConfig"
import FIcon from "@expo/vector-icons/Feather";
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import Icon from "@expo/vector-icons/Ionicons";
import {
  selectGroup,
	changeMemberIds,
} from "../../redux/reducers/groupSlice";


const GroupInfo = ({navigation}) => {
	const group = useSelector(selectGroup);
    const { colors } = useTheme();
    const [dataList, setDataList] = useState([])
    const [memberNameMap, setMemberNameMap] = useState({})

    const [dataPendingList, setDataPendingList] = useState([])
    const [pendingMap, setPendingMap] = useState({})
    // const groupID = "vwcofpwSCqh01WnAaqsZ" //useParam
    console.log("DataList", dataList)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    console.log("MemberName", memberNameMap)

	const fetchMemberName = async refList => {
		const memberDict = { ...memberNameMap };
		const members = [];
		for (let i = 0; i < refList.length; i++) {
			try {
				data = refList[i];
				if (!data.user_id in memberDict) {
					members.push(memberDict[data.user_id]);
					continue;
				}

				const res = await getUserInfo(data.user_id);

				memberDict[res.id] = {
					id: data.id,
					user_id: res.id,
					...res.data(),
					status: 1
				};

				members.push(memberDict[res.id]);
			} catch (e) { continue }
		}

		setDataList(members);
		setMemberNameMap(memberDict);
		dispatch(changeMemberIds(members.map(item => item.user_id)));
	};

	const fetchPendingData = async refList => {
		const memberDict = { ...pendingMap };
		const members = [];
		try {
			for (let i = 0; i < refList.length; i++) {
				data = refList[i];
				if (!data.receiver_id in memberDict) {
					members.push(memberDict[data.receiver_id]);
					continue;
				}

				const res = await getUserInfo(data.receiver_id);
				if (!res)
					continue

				memberDict[res.id] = {
					id: data.id,
					user_id: res.id,
					...res.data(),
					status: 0
				};

				members.push(memberDict[res.id]);
			}
		} catch (e) {
			console.log(e.message)
		}
		setDataPendingList(members);
		setPendingMap(memberDict);
	};

	useEffect(() => {
		const unsub1 = onSnapshot(query(collection(db, "groupNuser"), where("group_id", "==", group.groupId)), (snapshot) => {
		  const refList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
		  console.log(refList)
		  fetchMemberName(refList)
		})

		const unsub2 = onSnapshot(query(collection(db, "group_invitation"), where("group_id", "==", group.groupId), where("status", "==", 0)), (snapshot) => {
		  const refList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
		  console.log("Invite", refList)
		  fetchPendingData(refList)
		})

		return () => {unsub1(); unsub2(); }
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
                        {dataList.concat(dataPendingList).map((data, index) => {
                            return(
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
                                    label={data.name}
                                    icon={props => <Icon name="account" {...props} />}
                                    image={data.ava_url ? { uri: data.ava_url } : null}
                                    imageStyle={{ borderRadius: 10 }}
                                />
                                <Stack
                                    style={{ marginLeft: 17 }}
                                    spacing={5}
                                    w="40%"
                                >
                                    <Text style={styles.cardHeader} >
                                        {data.name}
                                    </Text>
                                    <Text style={styles.infoContent} >
                                        @{data.username}
                                    </Text>
                                </Stack>
								<Spacer />

                                <Stack >
									{data.status === 0 ?
									<Badge label="Pending" color="orange" tintColor="white" />
									: null}
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

