import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import styles from './styles'
import React from 'react'
import { useState, useEffect } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useTheme } from '@react-navigation/native';
import { Box, Flex, HStack, IconButton, Stack, VStack } from '@react-native-material/core'
import { useRef } from 'react'
import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import Config from "react-native-config";
import { getAddressFromGeopoint, getGeoCodeFromAddress } from '../common/Utils'
import { GOOGLE_MAPS_API_KEY } from '@env';


const SetAddress = ({ navigation }) => {
  const { colors } = useTheme();
  const [addressText, setAddressText] = useState({})
  const [searchInput, setSearchInput] = useState("")
  console.log("Search Input", searchInput)





  return (
    <Stack
      backgroundColor={colors.background}
      h="100%"
      w="100%"
      items="center"
      paddingTop={35}
    >
    <View style={{...styles.searchContainer,marginTop: Platform.OS == "ios" ? 50 : 40 }}>
      <GooglePlacesAutocomplete
        style={{flex: 1}}
        placeholder='Search Location'
        keepResultsAfterBlur = {true}
        onPress={(data, details) => {
          console.log(details)
          setAddressText({
            location: details.geometry.location,
            address: details.formatted_address,
          })
        }}
        minLength={2}
        fetchDetails={true}
        // GooglePlacesDetailsQuery={{
        //   fields: ['formatted_address', 'geometry'],
        // }}
        // renderRow={(rowData) => {
        //   const title = rowData.structured_formatting.main_text;
        //   const address = rowData.structured_formatting.secondary_text
        //   return(
        //     <View>
        //        <Text>{title}</Text>
        //        <Text style={styles.locationAddress}>{address}</Text>
        //     </View>
        //   )
        // }}
        query={{
          // key: 'AIzaSyAXtp-vw6IoEEWX6aVYD-Ug-2Qkp6uT-jE',
          key: 'AIzaSyAmdFtD0mKY5OkanGXSU6hR_-el1hKSpL4',
          language: 'en',
          components: 'country:vn'  // Limit to only Vietnam
        }}
      />

      </View> */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={{
            width: "100%",
            borderRadius: 15,
            padding: 17,
            backgroundColor: 'white'
          }}
          onPress={() => navigation.navigate("MapPin")}
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
