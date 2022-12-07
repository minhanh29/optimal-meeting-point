import { StyleSheet, Text, View, Button } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import styles from "./styles";
import Friend from "./Friend";

const Friends = () => {
  return (
    <View style={styles.container}>
      <View style={styles.friendsWrapper}>
        {/* <Text style={styles.title}>Friends List</Text> */}
        <View style={styles.items}>
          <Friend text={"Hoang Anh"} />
          <Friend text={"Bao Han"} />
          <Friend text={"Hula"} />
          <Friend text={"Minh Anh"} />
          <Friend text={"Ai Quynh"} />
        </View>
      </View>
    </View>
  );
};

export default Friends;
