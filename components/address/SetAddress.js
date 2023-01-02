import { Alert, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import styles from './styles'
import React from 'react'
import { useState, useEffect } from 'react'
import { useTheme } from '@react-navigation/native';
import { Box, Flex, HStack, IconButton, Stack, VStack } from '@react-native-material/core'
import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import AIcon from "@expo/vector-icons/AntDesign";
import Spinner from "react-native-loading-spinner-overlay";
import { GOONG_PUBLIC_KEY } from '../../key';



const SetAddress = ({ route, navigation }) => {
	const { setGeoLocation } = route.params;
  const { colors } = useTheme();
  const [suggestionList, setSuggestionList] = useState([])
  const [timeInput, setTimeInput] = useState(0)
  const [defaultValue, setDefaultValue] = useState("")
  const [loading, setLoading] = useState(false)
  // const [geoLocation, setGeoLocation] = useState(null)
  // console.log("GEO", geoLocation)


  const fetchData = async (data) => {
    setDefaultValue(data)
    console.log("Data", data)
    if (timeInput) {
      setTimeInput(clearTimeout(timeInput))
    }
    if (data.trim() == "") {
      setSuggestionList([])

      return
    }
    setTimeInput(setTimeout(async () => {
      try {


        let suggestion_list = []
        let url = "https://rsapi.goong.io/Place/AutoComplete?api_key=" + GOONG_PUBLIC_KEY + "&input=" + data;
        let res = await fetch(url)
        res = await res.json()
        if (res == null) {
          setSuggestionList([])
          return
        }
        res.predictions.map((location) => {
          const location_details = {
            place_id: location.place_id,
            description: location.description
          }
          suggestion_list.push(location_details)
        })
        setSuggestionList(suggestion_list)
      } catch (e) {
        console.log(e.message)
      }
    }, 300))
  }

  //Geocode
  const updateInput = async (content) => {
    setDefaultValue(content.description)
	setLoading(true)
    try {
      let url = "https://rsapi.goong.io/Place/Detail?place_id=" + content.place_id + "&api_key=" + GOONG_PUBLIC_KEY
      let res = await fetch(url)
      res = await res.json()
      await setGeoLocation({
		  location: {
			  latitude: res.result.geometry.location.lat,
			  longitude: res.result.geometry.location.lng,
		  },
        address_text: content.description
      })
		setLoading(false)
		Alert.alert(
			"Update Location",
			"Your location has been updated successfully",
			[
				{
					text: "OK",
					onPress:() => navigation.navigate("Dashboard"),
				}
			],
			{ cancelable: true }
		);
    } catch (e) {
		setLoading(false)
      console.log(e.message)
    }
  }

  return (
    <Stack
      backgroundColor={colors.background}
      h="100%"
      w="100%"
      items="center"
      paddingTop={35}
    >
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "white" }}
        cancelable={true}
      />
      <Stack w="90%" items="start">
        <HStack direction='row' w='100%' spacing={20} style={{ ...styles.searchHolder, marginTop: Platform.OS == "ios" ? 15 : 20 }}>
          <AIcon name="search1" size={24} style={styles.iconImg} color='B4BABC' />
          <TextInput
            style={styles.searchInput}
            placeholder='Search Location'
            color='#B4BABC'
            onChangeText={(newText) => fetchData(newText)}
            value={defaultValue}
          />
        </HStack>
        {suggestionList.length != 0 ?
          <ScrollView style={{ ...styles.listContainer }}>
            <Stack w='100%' spacing={30} backgroundColor='white' padding={20}>
              {suggestionList.map((item, index) => {
                return (
                  <TouchableOpacity
                    elevation={3}
                    backgroundColor="white"
                    onPress={() => updateInput(item)}
                    w='100%'
                    key={index}
                  >
                    <HStack
                      w="100%"
                      items="center"
                      spacing={10}
                    >
                      <Box style={styles.iconContainer}>
                        <Icon name="location-sharp" size={24} style={styles.iconStyle} />
                      </Box>
                      <Text style={styles.locationContent} >
                        {item.description}
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                )
              })}
            </Stack>
          </ScrollView>
          : <Stack></Stack>
        }

      </Stack>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={{
            width: "100%",
            borderRadius: 15,
            padding: 17,
            backgroundColor: 'white'
          }}
			onPress={() => navigation.navigate("MapPin", { setGeoLocation })}
        >
          <HStack display='flex' alignItems='center' spacing={20}>
            <FIcon name="map" size={24} style={styles.iconStyle} />
            <Text
              style={styles.buttonTitle}
              color="white"
            >
              Pin On Map
            </Text>
          </HStack>
        </TouchableOpacity>
      </View>
    </Stack>


  )
}

export default SetAddress

