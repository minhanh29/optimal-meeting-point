import { StyleSheet, View, Button, TextInput } from "react-native";
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { Avatar, Box, Stack, Icon, Text, Flex, Spacer, IconButton } from "@react-native-material/core";
import { db } from "../../firebaseConfig"
import { collection, getDocs } from "firebase/firestore";
import { connect, useDispatch, useSelector } from "react-redux";
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
// import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialIcons"
import styles from "./styles";
import { selectUser } from "../../redux/reducers/userSlice";
import { InstantSearch, connectRefinementList, connectHits } from "react-instantsearch-hooks";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

const FriendFilter = connectRefinementList(({items, refine, user_id}) => {
  console.log("User Id", user_id)
  useEffect(() => {
    refine(user_id)
  }, [user_id])
  return <View></View>
})

const FriendHits = connectHits(({hits, navigation}) => {
  const { colors } = useTheme();

  const dataList = hits.map(item => ({
    id: item.objectID,
    name: item.name,
    person1_id: item.person1_id,
    ava_url: item.ava_url,
    username: item.username,
    person2_id: item.person2_id
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
      keyExtractor={item => item.objectID}
      renderItem = {({item}) => (
        <Stack w='100%' spacing={20} mb={10}>
          <TouchableOpacity
            elevation={4}
            backgroundColor="white"
            style={styles.groupCardContainer}
            w='100%'>
              <Flex
                w="100%"
                items="center"
                direction="row">
                  <Stack
                    style={{marginLeft: 17}}
                    spacing={5}
                    w="70%">
                       <Avatar
                          label={item.name}
                          icon={props => <Icon name="account" {...props} />}
                          image={item.ava_url ? { uri: item.ava_url } : null}
                          imageStyle={{ borderRadius: 10 }}
                      />
                      <Text style={styles.cardHeader}>
                          {item.name}
                      </Text>
                      <Text style={styles.infoContent}>
                          @{item.username}
                      </Text>
                  </Stack>
              </Flex>
          </TouchableOpacity>
        </Stack>
      )}>
      </FlatList>
    </Stack>
  )
})
const Friends = ({hits, navigation}) => {
  const { colors } = useTheme();
  const user = useSelector(selectUser);

  return (
      <Stack
      backgroundColor={colors.background}
      h="100%"
      w="100%"
      items="center"
      paddingTop={35}
      >
          <Flex w="85%" direction="row">
            <InstantSearch searchClient={searchClient} indexName="friends">
                      <SearchBox searchBoxName= "Search group" />
              <GroupFilter user_id={user.user.id} attribute="user_id"/>
              <FriendHits/>
            </InstantSearch>
            <IconButton
            icon={props => <AIcon name="adduser" {...props} color='B4BABC' />}
            onPress={() => navigation.navigate("AddFriends")}
            />
          </Flex>
      </Stack>
  );
};

export default Friends;

