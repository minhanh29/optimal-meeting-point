import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import styles from './styles'
import React from 'react'
import { useState, useEffect } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useTheme } from '@react-navigation/native';
import { Box, Flex, HStack, IconButton, Stack, VStack } from '@react-native-material/core'
import { useRef } from 'react'
import Icon from "@expo/vector-icons/Ionicons";
import FIcon from "@expo/vector-icons/Feather";
import AIcon from "@expo/vector-icons/AntDesign";
import Config from "react-native-config";
import { getAddressFromGeopoint, getGeoCodeFromAddress } from '../common/Utils'
import { GOONG_PUBLIC_KEY } from '@env';


const SetAddress = ({ navigation }) => {
  const { colors } = useTheme();
  
  // const [searchInput, setSearchInput] = useState("")
  const [suggestionList, setSuggestionList] = useState([])
  const [timeInput, setTimeInput] = useState(0)
  


  // useEffect(() => {
  //   if(searchInput.length !=0 && searchInput.length % 5 == 0){
  //     fetchData()
  //   }
  // }, [searchInput])



  const fetchData = async (data) => {
    console.log("Data", data)
    if(timeInput){
      setTimeInput(clearTimeout(timeInput))
    }
    if(data.trim() == ""){
      setSuggestionList([])
      return
    }
    setTimeInput(setTimeout(async () => {
      try {
        let suggestion_list = []
        let url = "https://rsapi.goong.io/Place/AutoComplete?api_key=" + GOONG_PUBLIC_KEY + "&input=" + data;
        let res = await fetch(url)
        res = await res.json()
        if(res == null){
          setSuggestionList([])
          return
        }
        res.predictions.map((location) => {
          suggestion_list.push(location.description)
        })
        setSuggestionList(suggestion_list)
      } catch (e) {
        console.log(e.message)
      }
    }, 300))
    }
    

  const updateInput = (content) => {
    console.log("Content", content);
    // setSearchInput(content);
  }





  return (
    <Stack
      backgroundColor={colors.background}
      h="100%"
      w="100%"
      items="center"
      paddingTop={35}
    >
      <Stack w="90%" items="start">
        <HStack direction='row' w='100%' spacing={20} style={{ ...styles.searchHolder, marginTop: Platform.OS == "ios" ? 15 : 20 }}>
          <AIcon name="search1" size={24} style={styles.iconImg} color='B4BABC' />
          <TextInput
            style={styles.searchInput}
            placeholder='Search Location'
            color='#B4BABC'
            onChangeText={(newText) => fetchData(newText)}
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
                        {item}
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


