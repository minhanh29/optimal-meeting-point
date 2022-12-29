import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { IconButton } from "@react-native-material/core";

const Friend = (props) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Image
          style={styles.itemAvatar}
          source={{
            uri: "https://i.pinimg.com/474x/f7/dc/c5/f7dcc578da12b93b7d23a2391e5bdfe7.jpg",
          }}
        />
        <Text style={styles.itemText}>{props.text}</Text>
      </View>
      <View style={styles.itemButton}>
        <TouchableOpacity style={styles.leaveButton}></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 21,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemAvatar: {
    width: 45,
    height: 45,
    // backgroundColor: "blue",
    // opacity: 0.4,
    borderRadius: 15,
    marginRight: 15,
  },
  itemButton: {
    width: 40,
    height: 40,
    borderColor: "red",
    borderWidth: 2,
  },
  itemText: {
    maxWidth: "80%",
  },
});

export default Friend;
