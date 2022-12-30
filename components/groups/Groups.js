import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { Avatar, Box, Stack, Switch, Flex, Spacer, IconButton } from "@react-native-material/core";
import React, { useEffect } from 'react'
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialIcons"
import styles from "./styles"
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db, getGroupName } from "../../firebaseConfig"
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { useState } from 'react';
import { deleteGroupAsync, selectGroup, changeEnterGroup, GROUP_DELETE_PENDING, GROUP_DELETE_REJECTED, GROUP_DELETE_SUCCESS, changeGroupStatus, GROUP_IDLE } from '../../redux/reducers/groupSlice';
import Spinner from 'react-native-loading-spinner-overlay';

const Groups = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useSelector(selectUser);
  const [dataList, setDataList] = useState([]);
  const [groupNameMap, setGroupNameMap] = useState({});
  const dispatch = useDispatch();
  const group = useSelector(selectGroup);
  console.log("Data", dataList);


<<<<<<< HEAD

=======
>>>>>>> ee170111493700ec30b6ce1569f5264c0be715ad
  const fetchGroupName = async (refList) => {
    const groupDict = { ...groupNameMap }
    const groups = []
    try {
      for (let i = 0; i < refList.length; i++) {
        let data = refList[i]
        if (data.group_id in groupDict) {
          groups.push(groupDict[data.group_id])
          continue

        }
        const res = await getGroupName(data.group_id)
        // count group members
        const memData = await getDocs(query(collection(db, "groupNuser"), where("group_id", "==", data.group_id)))

        groupDict[res.id] = {
          id: data.id,
          group_id: data.group_id,
          count: memData.docs.length,
          ...res.data()
        }
        groups.push(groupDict[data.group_id])
      }
    } catch (e) {
      console.log(e.message);
    }
    setDataList(groups);
    setGroupNameMap(groupDict);
  };

  useEffect(
    () => onSnapshot(query(collection(db, "groupNuser"), where("user_id", "==", user.user.id)), (snapshot) => {
      // Update to Redux
      const refList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      fetchGroupName(refList)
    }
    ),
    []
  );

  useEffect(() => {
    if (group.status === GROUP_DELETE_REJECTED) {
      Alert.alert(
        "Leave Group",
        "Failed to leave group",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: true }
      )
      dispatch(changeGroupStatus(GROUP_IDLE))
    } if (group.status === GROUP_DELETE_SUCCESS) {
      Alert.alert(
        "Leave Group",
        "Leave group successfully",
        [
          {
            text: "OK",
            //   onPress:() => navigation.goBack(),
          },
        ],
        { cancelable: true }
      )
      dispatch(changeGroupStatus(GROUP_IDLE))
    }
  }, [group.status])


  //Left the group
  const handleDelete = (group_id) => {
    console.log("ID", group_id)
    dispatch(deleteGroupAsync(group_id))
  }

  const handleEnter = (id) => {
    console.log("Enter", id)
    dispatch(changeEnterGroup({
      enterGroup: true,
      groupId: id
    }))
    navigation.navigate("Dashboard")
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
          visible={group.status === GROUP_DELETE_PENDING}
          textContent={'Loading...'}
          textStyle={{ color: "white" }}
          cancelable={true}
        />
        <Flex direction='row' w='80%' style={{ ...styles.searchHolder, marginTop: Platform.OS == "ios" ? 15 : 20 }}>
          <AIcon name="search1" style={styles.iconImg} color='B4BABC' />
          <TextInput
            style={styles.searchInput}
            placeholder="Search group"
            color="#B4BABC"
          />
        </Flex>

        <ScrollView style={{ ...styles.listContainer, marginTop: 20 }}>
          <Stack w='100%' spacing={20}>
            {dataList.map((data, index) => {
              return (
                <TouchableOpacity
                  elevation={4}
                  backgroundColor="white"
                  style={styles.groupCardContainer}
                  w='100%'
                  key={index}
                  onPress={() => handleEnter(data.group_id)}
                >
                  <Flex
                    w="100%"
                    items="center"
                    direction="row"
                  >
                    <Stack
                      style={{ marginLeft: 17 }}
                      spacing={5}
                      w="70%"
                    >
                      <Text style={styles.cardHeader} >
                        {data.group_name}
                      </Text>
                      <Text style={styles.infoContent} >
                        {data.count} {data.count == 1 ? "member" : "members"}
                      </Text>
                    </Stack>

                    <IconButton
                      icon={props => <Icon name={'exit-outline'} {...props} />}
                      color="#EE6548"
                      style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
                      onPress={() => handleDelete(data.id)}
                    />
                  </Flex>
                </TouchableOpacity>
              )
            })}
          </Stack>
        </ScrollView>
        <Spacer />
        <Stack w="80%" items="center">
          <View style={styles.bottomContainer}>
            <View
              style={{
                ...styles.shadowBtn,
                shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5,
              }}
            >
              <IconButton
                style={{
                  alignSelf: "center",
                  overflow: "hidden",
                  padding: 25,
                  backgroundColor: "white",
                  borderRadius: 10,
                  marginBottom: 16,
                }}
                icon={(props) => <MIcon name="group-add" {...props} />}
                color="#9CC7CA"
                onPress={() => navigation.navigate("CreateGroup")}
              ></IconButton>
            </View>
          </View>
        </Stack>
        </Stack>
    </View>
  )
}

export default Groups
