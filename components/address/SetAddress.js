import { View, Text, TouchableOpacity } from 'react-native'
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


const SetAddress = ({navigation}) => {
  const { colors } = useTheme();
  const [addressText, setAddressText] = useState({})

  // console.log("KEY", Config.GOOGLE_MAPS_API_KEY)

  return (
    <Stack
      backgroundColor={colors.background}
      h="100%"
      w="100%"
      items="center"
      paddingTop={35}
    >
      <View style={{ ...styles.searchContainer, marginTop: Platform.OS == "ios" ? 27 : 18 }}>
        <GooglePlacesAutocomplete
          placeholder='Search Location'
          keepResultsAfterBlur={true}
          onPress={(data, details) => {
            setAddressText({
              location: details.geometry.location,
              address: details.formatted_address,
            })
          }}
         
          fetchDetails={true}
          // GooglePlacesDetailsQuery={{
          //   fields: ['formatted_address', 'geometry'],
          // }}
          renderRow={(rowData) => {
            const title = rowData.structured_formatting.main_text;
            const address = rowData.structured_formatting.secondary_text
            return (
              <View style={styles.dropDownList}>
                <HStack width='100%' spacing={20}>
                  <Box style={styles.iconContainer}>
                    <Icon name="location-sharp" size={24} style={styles.iconStyle} />
                  </Box>
                  <VStack style={styles.textContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.locationAddress}>{address}</Text>
                  </VStack>
                </HStack>
              </View>
            )
          }}
          query={{
            // key: Config.GOOGLE_MAPS_API_KEY,
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
            components: 'country:vn'  // Limit to only Vietnam
          }}
          enablePoweredByContainer={false}
        />

      </View>
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
          <HStack display='flex' alignItems= 'center' spacing={20}>
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
