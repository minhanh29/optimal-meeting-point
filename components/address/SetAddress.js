import { View, Text } from 'react-native'
import styles from './styles'
import React from 'react'
import { useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useTheme } from '@react-navigation/native';
import { Stack } from '@react-native-material/core'
import { useRef } from 'react'
import { useEffect } from 'react'

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
          // key: 'AIzaSyAXtp-vw6IoEEWX6aVYD-Ug-2Qkp6uT-jE',
          key: 'AIzaSyAmdFtD0mKY5OkanGXSU6hR_-el1hKSpL4',
          language: 'en',
          components: 'country:vn'  // Limit to only Vietnam
        }}
      />

    </View>
    </Stack>


  )
}

export default SetAddress
