import React, { useState, useEffect, useRef } from "react";
import { View, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
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
import { selectGroup, updateGroupInfo } from "../../redux/reducers/groupSlice";
// import { MAPBOX_PUBLIC_KEY } from '@env';
import { MAPBOX_PUBLIC_KEY } from "../../key";
import { geoToDict } from "../common/Utils";

import { getGroupName } from "../../firebaseConfig";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";

const mapStyle = mapStyleJson["mapStyle"];

import { db, updateAddress } from "../../firebaseConfig";
import {
  onSnapshot,
  doc,
  getDocs,
  getDoc,
  collection,
  query,
  where,
  documentId,
  GeoPoint,
} from "firebase/firestore";
import { ref, onValue, push, update, remove } from "firebase/database";
import { connectStorageEmulator } from "firebase/storage";
// import BottomSheet from "./BottomSheet";
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

const renderContent = (placeInfo) => {
  console.log("hello===============", placeInfo)

  return(
  <View style={styles.panel}>
    <View>
      <Text style={styles.panelTitle}>{placeInfo? placeInfo.placeName : "Name"}</Text>
      <Text style={styles.panelSubtitle}>{placeInfo? placeInfo.address : "Address"}</Text>
    </View>
    <TouchableOpacity style={styles.panelButton}>
      <Text style={styles.panelButtonTitle}>Choose This Location</Text>
    </TouchableOpacity>
  </View>
)};

const renderHeader = () => (
  <View style={styles.headerBottomSheet}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle}></View>
    </View>
  </View>
);

// const sheetRef = React.createRef();
const fall = new Animated.Value(1);

const AvaMarker = ({ groupID, setLocationList }) => {
  const [userList, setUserList] = useState([]);

  const fetchUsers = async (userIDs, userGroup) => {
    const users = [];
    const usersFromSnap = [];
    const q = query(collection(db, "user"), where(documentId(), "in", userIDs));
    const snap = await getDocs(q);

    if (snap) {
      snap.forEach(async (doc) => {
        usersFromSnap.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    }

    console.log("userGroup", userGroup);
    for (let i = 0; i < usersFromSnap.length; i++) {
      for (let j = 0; j < userGroup.length; j++) {
        let data = usersFromSnap[i];
        if (data.id === userGroup[j].user_id) {
          users.push({
            user_id: data.user_id,
            user_group_address: userGroup[j].user_group_address,
            username: data.username,
            name: data.name,
            ava_url: data.ava_url,
            gps_enabled: data.gps_enabled,
          });
        }
      }
    }

    console.log("users in fetchUsers", users.length, " ", users);
    setUserList(users);
  };

  const fetchGroupInfo = async (groupInfo) => {
    const users = []; // contains user_id & user_cur_address
    const userIDs = []; // array of user_ids only
    const locations = []; // array of locations only

    try {
      for (let i = 0; i < groupInfo.length; i++) {
        let data = groupInfo[i];

        users.push({
          user_id: data.user_id,
          user_group_address:
            typeof data.group_address !== "string" ? data.group_address : rmit,
        });

        userIDs.push(data.user_id);
        if (typeof data.group_address !== "string") {
          locations.push(data.group_address);
        }
      }
    } catch (error) {
      console.log(error.message);
    }

    console.log("new users list", users);
    console.log("locations list", locations);
    setLocationList(locations);
    fetchUsers(userIDs, users); // get users info with matching ids
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

  console.log("Count Length", userList && userList.length);

  return (
    <>
      {userList &&
        userList.map((user, index) => (
          <Marker
            coordinate={{
              latitude: user.user_group_address.latitude,
              longitude: user.user_group_address.longitude,
            }}
            title={"user"}
            key={index}
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

// const PlaceMarker = ({ suggestion }) => {
//   return (
//     <>
//       {suggestion.map((place, i) => (
//         <>
//           <Marker
//             key={i}
//             coordinate={place.coordinate}
//             title={place.placeName}
//             description={place.placeName}
//           >
//             <TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}>
//               <Image
//                 style={styles.marker_icon}
//                 source={require("../../assets/location-dot.png")}
//               ></Image>
//             </TouchableOpacity>
//           </Marker>
//           <BottomSheet
//             ref={sheetRef}
//             snapPoints={[550, 300, 0]}
//             style={styles.bottomSheetContainer}
//             renderContent={renderContent}
//             renderHeader={renderHeader}
//             initialSnap={2}
//             callbackNode={fall}
//             enabledGestureInteraction={true}
//           />
//         </>
//       ))}
//     </>
//   );
// };

const Dashboard = ({ navigation }) => {
  const user = useSelector(selectUser);
  const group = useSelector(selectGroup);
  const [groupData, setGroupData] = useState(null);
  const [middlePoint, setMiddlePoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const dispatch = useDispatch();
  const sheetRef = useRef()
  const [placeInfo, setPlaceInfo] = useState(null);

  useEffect(() => {
    if (group.enterGroup) {
      fetchGroupData();
    }
  }, [group.enterGroup, group.groupId]);

  const fetchGroupData = async () => {
    try {
      const snapshot = await getGroupName(group.groupId);
      const group_data = snapshot.data();
      setGroupData(group_data);
      dispatch(
        updateGroupInfo({
          group_id: snapshot.id,
          ...group_data,
          location:
            group_data.location && typeof group_data.location !== "string"
              ? geoToDict(group_data.location)
              : null,
          address:
            group_data.address && typeof group_data.address === "string"
              ? group_data.address
              : "",
        })
      );
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

    setLoading(true);
    let longitude = 0;
    let latitude = 0;
    for (let i = 0; i < locationList.length; i++) {
      latitude += locationList[i].latitude;
      longitude += locationList[i].longitude;
    }

    longitude /= locationList.length;
    latitude /= locationList.length;

    setMiddlePoint({ longitude, latitude });

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
        console.log("=====", res)

        for (let i = 0; i < res.features.length; i++) {
          let myPlace = res.features[i];
          let place = {};
          let coordinate = {
            latitude: myPlace.center[1],
            longitude: myPlace.center[0],
          };
          place["coordinate"] = coordinate;
          place["placeName"] = myPlace.text;
          place["address"] = myPlace.place_name;
          places.push(place);
        }
      }

      let pivot = { latitude, longitude };
      places.sort(
        (a, b) => distance(a.coordinate, pivot) - distance(b.coordinate, pivot)
      );

      setSuggestion(places.slice(0, Math.min(places.length, NUM_SUGGESTION)));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e.message);
    }
  };

  console.log("User id", user.user.id);
  const setGroupLocation = async (data) => {
    if (!group.enterGroup) return;

    try {
      // get groupNuser doc id
      const snapshot = await getDocs(
        query(
          collection(db, "groupNuser"),
          where("user_id", "==", user.user.id),
          where("group_id", "==", group.groupId)
        )
      );
      console.log("GroupNuser", snapshot);
      if (snapshot.docs.length == 0) return;
      const myDoc = snapshot.docs[0];
      console.log(data, myDoc.id);
      await updateAddress(myDoc.id, {
        group_address: new GeoPoint(
          data.location.latitude,
          data.location.longitude
        ),
      });
    } catch (e) {
      console.log(e.message);
    }
  };
  // console.log("User Info", user.user.address)
  console.log("suggestionnnnnnnnnnnn ", suggestion);
  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={"Finding meeting point..."}
        textStyle={{ color: "white" }}
        cancelable={true}
      />
      <StatusBar style="dark" backgroundColor="white" />
      <MapView
        style={styles.map}
        initialRegion={initRegion}
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
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

        {/* {suggestion.map((place, i) => (
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
        ))} */}

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

        {/* <PlaceMarker suggestion={suggestion}></PlaceMarker> */}

        {group.enterGroup &&
          suggestion.map((place, i) => (
            <View>
              <Marker
                key={i}
                coordinate={place.coordinate}
                title={place.placeName}
                description={place.placeName}
                onPress={() => {
                  setPlaceInfo(place);
                  sheetRef.current.snapTo(0);
                }}
              >
                  <Image
                    style={styles.marker_icon}
                    source={require("../../assets/location-dot.png")}
                  ></Image>
              </Marker>
            </View>
          ))}

        {/* // User's location Pin */}
        {group.enterGroup ? (
          <AvaMarker
            groupID={group.groupId}
            setLocationList={setLocationList}
          />
        ) : (
          <Marker
            coordinate={{
              latitude: user.user.address.latitude,
              longitude: user.user.address.longitude,
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
                  source={{ uri: user.user.ava_url }}
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
                  {user.user.username}
                </Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>

      {/* {group.enterGroup && groupData ? (
        <View style={styles.topContainer}>
          <Text style={styles.topTitle}>{groupData.group_name}</Text>
        </View>
      ) : null} */}
      
      <BottomSheet
				ref={sheetRef}
				snapPoints={[550, 300, 0]}
				style={styles.bottomSheetContainer}
				renderContent={() => renderContent(placeInfo)}
				renderHeader={renderHeader}
				initialSnap={2}
				callbackNode={fall}
				enabledGestureInteraction={true}
			/>
      {/* <BottomSheet>

      </BottomSheet> */}
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
              color={group.enterGroup ? "#EE6548" : "#C2C2C2"}
              disabled={!group.enterGroup}
              style={{
                alignSelf: "center",
                overflow: "hidden",
                padding: 25,
                backgroundColor: "white",
                borderRadius: 10,
                margin: 16,
                ...styles.shadowBtn,
              }}
              onPress={() =>
                navigation.navigate("Address", {
                  setGeoLocation: setGroupLocation,
                })
              }
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
              color={group.enterGroup ? "#EE6548" : "#C2C2C2"}
              disabled={!group.enterGroup}
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
        {group.enterGroup && groupData ? (
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
              onPress={() => navigation.navigate("GroupInfo")}
            />
          </View>
        ) : null}
      </View>

    </View>
  );
};

export default Dashboard;
