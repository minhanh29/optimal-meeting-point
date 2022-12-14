import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { Avatar, Box, Stack, Switch, Flex, Spacer, IconButton } from "@react-native-material/core";
import React, { useEffect } from 'react'
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialIcons"
import styles from "./styles"
import { documentId, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db, getGroupName } from "../../firebaseConfig"
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { useState } from 'react';
import { deleteGroupAsync, selectGroup, changeEnterGroup, GROUP_DELETE_PENDING, GROUP_DELETE_REJECTED, GROUP_DELETE_SUCCESS, changeGroupStatus, GROUP_IDLE } from '../../redux/reducers/groupSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import { InstantSearch, connectRefinementList, connectHits } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";

const GroupFilter = connectRefinementList(({ items, refine, user_id }) => {
	useEffect(() => {
		refine(user_id);
	}, [user_id]);

	return <View></View>;
});


const GroupHits = connectHits(({hits, navigation}) => {
	const { colors } = useTheme();
	const [searchString, setSearchString] = useState("")
	const user = useSelector(selectUser);
	const [dataList, setDataList] = useState([]);
	const [groupNameMap, setGroupNameMap] = useState({});
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const group = useSelector(selectGroup);

	const loadMemberCount = async (groupDict) => {
		try {
			const result = {}
			for (const [key, value] of Object.entries(groupDict)) {
				if (value.count !== -1) {
					result[key] = value
					continue
				}

				const memData = await getDocs(
					query(
						collection(db, "groupNuser"),
						where("group_id", "==", value.group_id)
					)
				);
				result[key] = {
					...value,
					count: memData.docs.length,
				}
			}

			// update data list
			let groups = Array.from(new Map(Object.entries(result)).values());
			groups.sort((a, b) => a.group_name.localeCompare(b.group_name));
			setDataList(groups);
			setGroupNameMap(groupDict);
		} catch (e) {
			console.log(e.message)
		}
	};

	const fetchGroupData = async refList => {
		const groupDict = { ...groupNameMap };
		let groups = [];

		try {
			// get group data
			const groupIdList = refList.map(item => item.group_id);
			const groupIdToRef = refList.reduce((map, item) => {
				map[item.group_id] = item.id;
				return map;
			}, {});

			let myDocs = []
			for (let i = 0; i < groupIdList.length / 10.0; i++) {
				let groupData = await getDocs(
					query(
						collection(db, "group"),
						where(documentId(), "in", groupIdList.slice(i, Math.min(i+10, groupIdList.length)))
					)
				);

				myDocs = myDocs.concat(groupData.docs)
			}

			myDocs.forEach(doc => {
				groupDict[doc.id] = {
					id: groupIdToRef[doc.id],
					group_id: doc.id,
					count: -1,
					...doc.data()
				};
			});

			groups = Array.from(new Map(Object.entries(groupDict)).values());
			groups.sort((a, b) => a.group_name.localeCompare(b.group_name));
		} catch (e) {
			console.log(e.message);
		}
		setDataList(groups);
		setGroupNameMap(groupDict);
		setLoading(false);

		loadMemberCount(groupDict)
	};

	const fetchGroupHits = async hits => {
		const groupDict = {};

		hits.forEach(item => {
			groupDict[item.group_id] = {
				id: item.objectID,
				group_id: item.group_id,
				group_name: item.group_name,
				user_id: item.user_id,
				count: -1,
			};
		});

		let groups = Array.from(new Map(Object.entries(groupDict)).values());
		groups.sort((a, b) => a.group_name.localeCompare(b.group_name));

		setDataList(groups);
		setGroupNameMap(groupDict);
		setLoading(false);

		loadMemberCount(groupDict)
	};

	useEffect(() => {
		if (searchString.trim() === "") {
			const unsub = onSnapshot(query(collection(db, "groupNuser"), where("user_id", "==", user.user.id)), (snapshot) => {
			  // Update to Redux
			  const refList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			  fetchGroupData(refList)
			})
			return () => unsub()
		} else {
			fetchGroupHits(hits)
		}

	}, [hits, searchString]);

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
  const handleDelete = (groupNuser_id) => {
    console.log("Delete ID", groupNuser_id)
    dispatch(deleteGroupAsync(groupNuser_id))
  }

  const handleEnter = (id) => {
    console.log("Enter", id)
    dispatch(changeEnterGroup({
      enterGroup: true,
      groupId: id,
    }))
    navigation.navigate("Dashboard")
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
		  visible={group.status === GROUP_DELETE_PENDING || loading}
		  textContent={'Loading...'}
		  textStyle={{ color: "white" }}
		  cancelable={true}
		/>
		<Stack mt={15} w="100%" items="center">
			<SearchBox width="80%" searchBoxName="Search group" setSearchString={setSearchString} />
		</Stack>
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
						{data.count == -1 ?
                      <Text style={styles.infoContent} >
						  Counting members...
					  </Text>:
                      <Text style={styles.infoContent} >
                        {data.count} {data.count == 1 ? "member" : "members"}
                      </Text>}
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
						shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5
					}}
				>
					<IconButton
						style={{
							alignSelf: "center",
							overflow: "hidden",
							padding: 25,
							backgroundColor: "white",
							borderRadius: 10,
							marginBottom: 16
						}}
						icon={props => <MIcon name="group-add" {...props} />}
						color="#9CC7CA"
						onPress={() => navigation.navigate("CreateGroup")}
					></IconButton>
				</View>
			</View>
		</Stack>
	</Stack>
  )
})

const Groups = ({ navigation }) => {
	const user = useSelector(selectUser);

	return (
	<InstantSearch searchClient={searchClient} indexName="group">
		<GroupFilter user_id={user.user.id} attribute="user_id" />
		<GroupHits navigation={navigation} />
	</InstantSearch>
	);
};

export default Groups
