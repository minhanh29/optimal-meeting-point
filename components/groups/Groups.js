import { Text, View, TouchableOpacity, Platform } from 'react-native'
import { Stack, Flex, Spacer, IconButton } from "@react-native-material/core";
import React, { useEffect } from 'react'
import { useTheme } from '@react-navigation/native';
import Icon from "@expo/vector-icons/Ionicons";
import MIcon from "@expo/vector-icons/MaterialIcons"
import styles from "./styles"
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';
import { deleteGroupAsync, changeEnterGroup } from '../../redux/reducers/groupSlice';
import { InstantSearch, connectRefinementList, connectHits } from "react-instantsearch-native";
import { searchClient } from "../../App";
import SearchBox from "../search/SearchBox";

const GroupFilter = connectRefinementList(({ items, refine, user_id }) => {

	console.log("User ID", user_id)
	useEffect( () => {
		refine(user_id)
	}, [user_id]);

	return <View></View>
})

const GroupHits = connectHits(({hits, navigation}) => {
  const { colors } = useTheme();
  const dispatch = useDispatch()
	console.log("Hits", hits)

  const handleDelete = (group_id) => {
    console.log("ID",group_id)
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

	const dataList = hits.map(item => ({
		id: item.objectID,
		group_id: item.group_id,
		group_name: item.group_name,
		user_id: item.user_id,
	}))


  return (
      <Stack
        backgroundColor={colors.background}
        h="100%"
        w="100%"
        items="center"
        paddingTop={35}
      >
        <Stack w='80%' spacing={20} marginTop={20}>
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
              </TouchableOpacity>
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

  )
})

const Groups = ({ navigation }) => {
  const user = useSelector(selectUser)

  return (
    <View>
		<InstantSearch searchClient={searchClient} indexName="group">
            <SearchBox searchBoxName= "Search group" />
			<GroupFilter user_id={user.user.id} attribute="user_id"/>
			<GroupHits navigation={navigation} />
		</InstantSearch>
    </View>

  )
}

export default Groups

