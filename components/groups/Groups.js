import { StyleSheet, Text, View, TextInput } from 'react-native'
import { Avatar, Box, Stack, Switch, Flex, Spacer, IconButton } from "@react-native-material/core";
import React, { useEffect } from 'react'
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialIcons"
import styles from "./styles"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"
const Groups = ({ navigation }) => {
  const { colors } = useTheme();

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
          <Box
            elevation={4}
            backgroundColor="white"
            style={styles.groupCardContainer}
            w='100%'
          // key={index}
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
                  BI
                </Text>
                <Text style={styles.infoContent} >
                  3 members
                </Text>
              </Stack>

              <IconButton
                icon={props => <Icon name={'exit-outline'} {...props} />}
                color="#EE6548"
                style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
              // onPress={() => handleAdd(user)}
              />
            </Flex>
          </Box>
          <Box
            elevation={4}
            backgroundColor="white"
            style={styles.groupCardContainer}
            w='100%'
          // key={index}
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
                  BI
                </Text>
                <Text style={styles.infoContent} >
                  3 members
                </Text>
              </Stack>

              <IconButton
                icon={props => <Icon name={'exit-outline'} {...props} />}
                color="#EE6548"
                style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
              // onPress={() => handleAdd(user)}
              />
            </Flex>
          </Box>
        </Stack>
        <Spacer />
        <Stack w='80%' items="center"> 
          <View style={styles.bottomContainer}>
            <View style={{...styles.shadowBtn, shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5}}>
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

