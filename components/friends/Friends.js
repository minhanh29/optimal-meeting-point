import { StyleSheet, View, Button } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { Avatar, Box, Stack, Icon, Text, Flex, Spacer } from "@react-native-material/core";
import { db } from "../../firebaseConfig"
import { collection, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useTheme } from '@react-navigation/native';
import AIcon from "@expo/vector-icons/AntDesign";
// import styles from "./styles";

const Friends = ({navigate}) => {
  const { colors } = useTheme();
  return (
    <Stack backgroundColor={colors.background}
    h="100%"
    w="100%"
    items="center"
    paddingTop={50}
    spacing={20}
    >
      <Box elevation={4}
      backgroundColor="white"
      >
        <Flex w="100%"
        items="center"
        direction="row">
          <AIcon name="seach1" size={24} color="#C2C2C2"/>
        </Flex>
      </Box>

    </Stack>
  );
};

export default Friends;

const styles = StyleSheet.create({});
