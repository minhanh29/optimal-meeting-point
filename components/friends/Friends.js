import { StyleSheet, View, Button, TextInput } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { Avatar, Box, Stack, Icon, Text, Flex, Spacer, IconButton } from "@react-native-material/core";
import { db } from "../../firebaseConfig"
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
// import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialIcons"
import styles from "./styles";
import { selectUser } from "../../redux/reducers/userSlice";

const Friends = ({navigation}) => {
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
			  <Flex w="90%" style={styles.searchHolder} direction="row">
				<AIcon name="search1" style={styles.iconImg} color='B4BABC'/>
				<TextInput
				  style={styles.searchInput}
				  placeholder='Search friends'
				  color='#B4BABC'
				/>
			  </Flex>
            <IconButton
            icon={props => <AIcon name="adduser" {...props} color='B4BABC' />}
            onPress={() => navigation.navigate("AddFriends")}
            />

          </Flex>

      </Stack>
  );
};

export default Friends;

