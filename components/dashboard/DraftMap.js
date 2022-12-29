import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  cloneElement,
} from "react";
import { View, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Svg from "react-native-svg";
import { IconButton, Text } from "@react-native-material/core";
import Icon from "@expo/vector-icons/Feather";
import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import AIcon from "@expo/vector-icons/AntDesign";
import FIcon from "@expo/vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import mapStyleJson from "./../../mapStyle.json";
import styles from "./styles";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import { selectGroup} from "../../redux/reducers/groupSlice";
// import { MAPBOX_PUBLIC_KEY } from '@env';
import { MAPBOX_PUBLIC_KEY } from '../../key';

import { getGroupName } from "../../firebaseConfig";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
const mapStyle = mapStyleJson["mapStyle"];

import { db } from "../../firebaseConfig";
import {
  onSnapshot,
  doc,
  getDocs,
  collection,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { ref, onValue, push, update, remove } from "firebase/database";
import { connectStorageEmulator } from "firebase/storage";
const radius = 2 * 1000; // 2km
const placeType = "cafe";
const placeTypes = ["coffee", "food"];
const NUM_SUGGESTION = 5;

const locationList = [
  {
    latitude: 10.729567,
    longitude: 106.6930756,
  },
  {
    latitude: 10.795132588703474,
    longitude: 106.72191374093879,
  },
  {
    latitude: 10.715902,
    longitude: 106.740016,
  },
];

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

const renderContent = () => (
  <View style={styles.panel}>
    <View>
      <Text style={styles.panelTitle}>Location's Name</Text>
      <Text style={styles.panelSubtitle}>Location's Address</Text>
    </View>
    <TouchableOpacity style={styles.panelButton}>
      <Text style={styles.panelButtonTitle}>Choose This Location</Text>
    </TouchableOpacity>
  </View>
);

const renderHeader = () => (
  <View style={styles.headerBottomSheet}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle}></View>
    </View>
  </View>
);

const sheetRef = React.createRef();
const fall = new Animated.Value(1);

const AvaMarker = ({ groupID, setLocationList }) => {
  const [userList, setUserList] = useState([]);
  const [userIDList, setUserIDList] = useState([]);

  const fetchUsers = async (userIDs) => {
    const users = [];
    const q = query(
      collection(db, "user"),
      where(documentId(), "in", userIDs)
    );
    const snap = await getDocs(q);

    if (snap) {
      snap.forEach(async (doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    console.log("users in fetchUsers", users.length, " ", users);
    setUserList(users);
  };

  const fetchGroupInfo = async (groupInfo) => {
    const userIDs = [];
    const locations = [];
    try {
      for (let i = 0; i < groupInfo.length; i++) {
        let data = groupInfo[i];
        userIDs.push(data.user_id);
        if (typeof(data.group_address) !== "string") {
          locations.push(data.group_address);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    setUserIDList(userIDs);
    setLocationList(locations);
    console.log("check locations", locations);
    fetchUsers(userIDs); // get users info with matching ids
  };

  useEffect(() => {
    const unsubcribe = onSnapshot(
      query(collection(db, "groupNuser"), where("group_id", "==", groupID)),
      (snapshot) => {
        const groupInfo = snapshot.docs.map((doc) => doc.data());
        console.log(
          "Group Info in UE",
          snapshot.docs.map((doc) => doc.id)
        );
        fetchGroupInfo(groupInfo);
      }
    );
    return () => unsubcribe();
  }, [groupID]);

  // useEffect(
  //   () =>
  //     onSnapshot(query(collection(db, "user")), (snapshot) => {
  //       const userInfo = snapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }));
  //       // console.log("User Info in UE", userInfo);
  //       setAllUsers(userInfo);
  //     }),
  //   []
  // );

  // console.log("Data", userList && userList);
  console.log("Count Length", userList && userList.length);
  // console.log("Check address", userList && userList[0].address);

  return (
    <>
      {userList &&
        userList.map((user) => (
          <Marker
            coordinate={{
              latitude: user.address.latitude,
              longitude: user.address.longitude,
            }}
            title={"user"}
          >
            <View></View>
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
                  source={{ uri: user.ava_url }}
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
                  width: 120,
                  height: 30,
                }}
              >
                <Text
                  style={{
                    marginLeft: 2,
                    marginBottom: 1,
                    color: "black",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  {user.username}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
    </>
  );
};

const Dashboard = ({ navigation }) => {
  const user = useSelector(selectUser);
  const group = useSelector(selectGroup);
  const [groupData, setGroupData] = useState(null);
  const [middlePoint, setMiddlePoint] = useState(null);
  const [suggestion, setSuggestion] = useState([]);
  const [locationList, setLocationList] = useState(null);

  useEffect(() => {
    if (group.enterGroup) {
      fetchGroupData();
    }
  }, [group.enterGroup, group.groupId]);

  const fetchGroupData = async () => {
    try {
      const group_data = await getGroupName(group.groupId);
      setGroupData(group_data.data());
    } catch (e) {
      console.log(e.message);
    }
  };
  const distance = (pt1, pt2) => {
    return (
      Math.pow(pt1.longitude - pt2.longitude, 2) +
      Math.pow(pt1.latitude - pt2.latitude, 2)
    );
  };

  const findMeetingPoints = async () => {
    if (locationList.length == 0) {
      Alert.alert(
        "Error",
        "There must be at least one user's location",
        [{ text: "OK" }],
        { cancelable: true }
      );
      return;
    }

    let longitude = 0;
    let latitude = 0;
    for (let i = 0; i < locationList.length; i++) {
      latitude += locationList[i].latitude;
      longitude += locationList[i].longitude;
    }

    longitude /= locationList.length;
    latitude /= locationList.length;

    setMiddlePoint({ longitude, latitude });

    // const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/coffee.json?bbox=" + minLon + "," + minLat +  "," + maxLon + "," + maxLat +"&access_token=" + MAPBOX_PUBLIC_KEY

    // const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=" + radius + "&type=" + placeType + "&key=" + GOOGLE_MAPS_API_KEY;
    try {
      let places = [];
      for (let k = 0; k < placeTypes.length; k++) {
        let url =
          "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          placeTypes[k] +
          ".json?proximity=" +
          longitude +
          "," +
          latitude +
          "&access_token=" +
          MAPBOX_PUBLIC_KEY;
        let res = await fetch(url);
        res = await res.json();

        for (let i = 0; i < res.features.length; i++) {
          let myPlace = res.features[i];
          let place = {};
          let coordinate = {
            latitude: myPlace.center[1],
            longitude: myPlace.center[0],
          };
          place["coordinate"] = coordinate;
          place["placeName"] = myPlace.text;
          places.push(place);
        }
      }

      let pivot = { latitude, longitude };
      places.sort(
        (a, b) => distance(a.coordinate, pivot) - distance(b.coordinate, pivot)
      );

      setSuggestion(places.slice(0, Math.min(places.length, NUM_SUGGESTION)));
    } catch (e) {
      console.log(e.message);
    }
  };
  // console.log("User Info", user.user.address)
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="white" />
      <MapView
        style={styles.map}
        initialRegion={initRegion}
        customMapStyle={mapStyle}
      >
        {/* {middlePoint ? */}
        {/* <Marker */}
        {/* 	coordinate={middlePoint} */}
        {/* 	// title={"RMIT"} */}
        {/* 	// description={"RMIT University"} */}
        {/* > */}
        {/* 	<TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}> */}
        {/* 		<Image */}
        {/* 			style={styles.marker_icon} */}
        {/* 			source={require("../../assets/location-dot.png")} */}
        {/* 		></Image> */}
        {/* 	</TouchableOpacity> */}
        {/* </Marker>: null} */}
        {suggestion.map((place, i) => (
          <Marker
            key={i}
            coordinate={place.coordinate}
            // title={"RMIT"}
            // description={"RMIT University"}
          >
            <TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}>
              <Image
                style={styles.marker_icon}
                source={require("../../assets/location-dot.png")}
              ></Image>
            </TouchableOpacity>
          </Marker>
        ))}
        {/* {middlePoint ? */}
        {/* <Marker */}
        {/* 	coordinate={middlePoint} */}
        {/* 	title={"RMIT"} */}
        {/* 	description={"RMIT University"} */}
        {/* > */}
        {/* 	<TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}> */}
        {/* 		<Image */}
        {/* 			style={styles.marker_icon} */}
        {/* 			source={require("../../assets/location-dot.png")} */}
        {/* 		></Image> */}
        {/* 	</TouchableOpacity> */}
        {/* </Marker>: null} */}
        {suggestion.map((place, i) => (
          <Marker
            key={i}
            coordinate={place.coordinate}
            title={place.placeName}
            description={place.placeName}
          >
            <TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}>
              <Image
                style={styles.marker_icon}
                source={require("../../assets/location-dot.png")}
              ></Image>
            </TouchableOpacity>
          </Marker>
        ))}

        {/* // User's location */}
        {group.enterGroup ? (
          <AvaMarker
            groupID={group.groupId}
            setLocationList={setLocationList}
          />
        ) : null}
      </MapView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[550, 300, 0]}
        style={styles.bottomSheetContainer}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={2}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      {groupData ? (
        <View style={styles.topContainer}>
          <Text style={styles.topTitle}>{groupData.group_name}</Text>
        </View>
      ) : null}

      <View style={styles.bottomContainer}>
        <View style={styles.bottomNav}>
          <View
            style={{
              ...styles.shadowBtn,
              shadowOpacity: Platform.OS == "ios" ? 0.25 : 0.5,
            }}
          >
            <IconButton
              icon={(props) => <Icon name="map-pin" {...props} />}
              color="#EE6548"
              style={{
                alignSelf: "center",
                overflow: "hidden",
                padding: 25,
                backgroundColor: "white",
                borderRadius: 10,
                margin: 16,
                ...styles.shadowBtn,
              }}
              onPress={() => navigation.navigate("Address")}
            />
          </View>
          <View
            style={{
              ...styles.shadowBtn,
              shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5,
            }}
          >
            <IconButton
              icon={(props) => <MIcon name="account-group" {...props} />}
              color="#9CC7CA"
              style={{
                alignSelf: "center",
                padding: 25,
                backgroundColor: "white",
                borderRadius: 10,
                margin: 16,
                ...styles.shadowBtn,
              }}
              onPress={() => navigation.navigate("Groups")}
            />
          </View>
          <View
            style={{
              ...styles.shadowBtn,
              shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5,
            }}
          >
            <IconButton
              icon={(props) => <AIcon name="search1" {...props} />}
              // color="#C2C2C2"
              color="#EE6548"
              style={{
                alignSelf: "center",
                padding: 25,
                backgroundColor: "white",
                borderRadius: 10,
                margin: 16,
                ...styles.shadowBtn,
              }}
              onPress={findMeetingPoints}
            />
          </View>
        </View>
      </View>
      <View style={styles.sideContainer}>
        <View
          style={{
            ...styles.shadowBtn,
            shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5,
          }}
        >
          <IconButton
            icon={(props) => <FIcon name="bell" {...props} />}
            color="#9CC7CA"
            style={{
              alignSelf: "center",
              padding: 25,
              backgroundColor: "white",
              borderRadius: 10,
              margin: 12,
              ...styles.shadowBtn,
            }}
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>
        <View
          style={{
            ...styles.shadowBtn,
            shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5,
          }}
        >
          <IconButton
            icon={(props) => <AIcon name="setting" {...props} />}
            color="#9CC7CA"
            style={{
              alignSelf: "center",
              padding: 25,
              backgroundColor: "white",
              borderRadius: 10,
              margin: 12,
              ...styles.shadowBtn,
            }}
            onPress={() => navigation.navigate("Settings")}
          />
        </View>
        <View
          style={{
            ...styles.shadowBtn,
            shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5,
          }}
        >
          <IconButton
            icon={(props) => <AIcon name="contacts" {...props} />}
            color="#9CC7CA"
            style={{
              alignSelf: "center",
              padding: 25,
              backgroundColor: "white",
              borderRadius: 10,
              margin: 12,
              ...styles.shadowBtn,
            }}
            onPress={() => navigation.navigate("Friends")}
          />
        </View>
        {groupData ? (
          <View
            style={{
              ...styles.shadowBtn,
              shadowOpacity: Platform.OS == "ios" ? 0.23 : 0.5,
            }}
          >
            <IconButton
              icon={(props) => <MaterialIcons name="info-outline" {...props} />}
              color="#9CC7CA"
              style={{
                alignSelf: "center",
                padding: 25,
                backgroundColor: "white",
                borderRadius: 10,
                margin: 12,
                ...styles.shadowBtn,
              }}
              onPress={() => navigation.navigate("Friends")}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default Dashboard;
