import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import MapView, { Callout, Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import Svg, { Image as Imagesvg } from "react-native-svg";
import {
  AppBar,
  HStack,
  IconButton,
  Stack,
  Text,
  Image as ImageMaterial,
} from "@react-native-material/core";

import mapStyleJson from "./mapStyle.json";
import ava from "./images/naruto_ava.jpg";

const mapStyle = mapStyleJson["mapStyle"];

const initRegion = {
  latitude: 10.729567,
  longitude: 106.6930756,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const rmit = {
  latitude: 10.729567,
  longitude: 106.6930756,
};

const myLocation = {
  latitude: 10.795132588703474,
  longitude: 106.72191374093879,
};

const App = () => {
  return (
    <View>
      <StatusBar style="dark" backgroundColor="white" />
      <MapView
        style={styles.map}
        initialRegion={initRegion}
        customMapStyle={mapStyle}
      >
        <Marker
          coordinate={rmit}
          title={"RMIT"}
          description={"RMIT University"}
          // image={require("./assets/location-dot.png") }
        >
          <Image
            style={styles.marker_icon}
            source={require("./assets/location-dot.png")}
          ></Image>
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.locationName}>Location's name</Text>
                <Text>Description</Text>
                <Image
                  style={styles.image}
                  source={require("./images/bingsu.webp")}
                />
              </View>
              {/* <View style={styles.arrowBorder}></View>
              <View style={styles.arrow}></View> */}
            </View>
          </Callout>
        </Marker>
        <Marker
          coordinate={myLocation}
          title={"user"}
          description={"user info"}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#00bfff",
              borderTopLeftRadius: 60,
              borderTopRightRadius: 60,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 60,
              transform: [{ rotate: "45deg" }],
              alignSelf: "flex-start",
              height: 45,
              width: 45,
            }}
          >
            <Svg width={40} height={30}>
              <Image
                source={require("./images/avatar.jpeg")}
                width={40}
                height={30}
                style={{
                  height: 40,
                  width: 40,
                  transform: [{ rotate: "-45deg" }],
                  borderRadius: 90,
                  position: "absolute",
                  left: 1.5, // 1.5
                  bottom: -42, // -32
                }}
              />
            </Svg>
          </View>
          <Callout>
            <View
              style={{
                flexDirection: "column",
                width: 100,
                height: 50,
              }}
            >
              <Text
                style={{
                  marginLeft: 2,
                  marginBottom: 1,
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                User name
              </Text>
              <Text
                style={{
                  marginLeft: 2,
                  color: "black",
                }}
              >
                Description
              </Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  marker_icon: {
    height: 35,
    width: 35,
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 200,
  },
  userCallout: {
    width: 100,
    height: 100,
  },
  locationName: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    marginBottom: 1,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  image: {
    width: 120,
    height: 80,
  },
});

export default App;
