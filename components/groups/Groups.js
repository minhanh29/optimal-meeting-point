import { StyleSheet, Text, View, TextInput } from 'react-native'
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
import { deleteGroupAsync, selectGroup } from '../../redux/reducers/groupSlice';
const Groups = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useSelector(selectUser)
  const [dataList, setDataList] = useState([])
  const [groupNameMap, setGroupNameMap] = useState({})
  const dispatch = useDispatch()
  const group = useSelector(selectGroup);
  console.log(groupNameMap)
  const result = {}

  //Cannot see the group name after creating group
  const fetchGroupName = async () => {
    try {
      const res = await getGroupName()
      const result = {}
      res.forEach(doc => {
        result[doc.id] = doc.data().group_name
      })
      
      setGroupNameMap(result)
    } catch (e) { }
  }

  useEffect(
    () => onSnapshot(query(collection(db, "groupNuser"), where("user_id", "==", user.user.id)), (snapshot) => {
        // Update to Redux
        setDataList(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    ),
    []
);

  useEffect(() => {
    fetchGroupName()
  },[])


  //Left the group
  const handleDelete = (group_id) => {
    console.log("ID",group_id)
    dispatch(deleteGroupAsync(group_id))
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
        <Flex direction='row' w='80%' style={styles.searchHolder}>
          <AIcon name="search1" style={styles.iconImg} color='B4BABC' />
          <TextInput
            style={styles.searchInput}
            placeholder='Search group'
            color='#B4BABC'
          />
        </Flex>

        <Stack w='80%' spacing={20} marginTop={20}>
          {dataList.map((data, index) => {
            return (
              <Box
                elevation={4}
                backgroundColor="white"
                style={styles.groupCardContainer}
                w='100%'
                key={index}
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
                      {groupNameMap[data.group_id]}
                    </Text>
                    <Text style={styles.infoContent} >
                      3 members
                    </Text>
                  </Stack>

                  <IconButton
                    icon={props => <Icon name={'exit-outline'} {...props} />}
                    color="#EE6548"
                    style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
                    onPress={() => handleDelete(data.id)}
                  />
                </Flex>
              </Box>
            )
          })}
        </Stack>
        <Spacer />
        <Stack w='80%' items="center">
          <View style={styles.bottomContainer}>
            <View style={{ ...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5 }}>
              <IconButton
                style={{ alignSelf: "center", overflow: 'hidden', padding: 25, backgroundColor: 'white', borderRadius: 10, marginBottom: 16, }}
                icon={props => <MIcon name="group-add" {...props} />}
                color="#9CC7CA"
                onPress={() => navigation.navigate("CreateGroup")}
              >
              </IconButton>
            </View>
          </View>
        </Stack>
      </Stack>
    </View>
  )
}

export default Groups

