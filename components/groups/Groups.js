import { Text, View, TouchableOpacity, Platform, FlatList } from 'react-native'
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
  navigation.navigate("Dashboard")
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
        paddingTop={20}
      >
         <FlatList
        style={styles.listContainer}
        data={dataList}
        height={0}
        keyExtractor={item => item.objectID}
        renderItem = {({item}) => (
        <Stack w='100%' spacing={20} mb={10}>
          <TouchableOpacity
            elevation={4}
            backgroundColor="white"
            style={styles.groupCardContainer}
            w='100%'
            onPress={() => handleEnter(item.group_id)}
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
                  {item.group_name}
                </Text>
                <Text style={styles.infoContent} >
                  3 members
                </Text>
              </Stack>

              <IconButton
                icon={props => <Icon name={'exit-outline'} {...props} />}
                color="#EE6548"
                style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
                onPress={() => handleDelete(item.id)}
              />
            </Flex>
          </TouchableOpacity>
            )
        </Stack>
        )}/>
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

export default Groups;