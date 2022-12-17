import { View, Text } from 'react-native'
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

const SetAddress = () => {
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
          style={{ flex: 1 }}
          placeholder='Search Location'
          keepResultsAfterBlur={true}
          onPress={(data, details) => {
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
          renderRow={(rowData) => {
            const title = rowData.structured_formatting.main_text;
            const address = rowData.structured_formatting.secondary_text
            return (
              <View style={{width: '100%'}}>
                <HStack width='100%' spacing={15}>
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
            key: "AIzaSyAmdFtD0mKY5OkanGXSU6hR_-el1hKSpL4",
            language: 'en',
            components: 'country:vn'  // Limit to only Vietnam
          }}
          enablePoweredByContainer={false}
        />

      </View>
    </Stack>


  )
}

export default SetAddress
