import { View, Text } from 'react-native'
import styles from './styles'
import React from 'react'
import { useState, useEffect } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useTheme } from '@react-navigation/native';
import { Stack } from '@react-native-material/core'
import { useRef } from 'react'
import Config from "react-native-config";

const SetAddress = () => {
  const { colors } = useTheme();
  const [addressText, setAddressText] = useState({})
  console.log("Ađress", addressText)
  const ref = useRef()



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
          key: Config.GOOGLE_MAPS_API_KEY,
          language: 'en',
          components: 'country:vn'  // Limit to only Vietnam
        }}
      />

    </View>
    </Stack>


  )
}

export default SetAddress
