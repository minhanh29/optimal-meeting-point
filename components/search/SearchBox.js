import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Flex, Stack } from "@react-native-material/core";
import AIcon from "@expo/vector-icons/AntDesign";
import PropTypes from 'prop-types';
import { connectSearchBox } from "react-instantsearch-native";

const SearchBox = ({currentRefinement, refine}) => {
    return(
        <Stack mt={45} h="100%" w="100%" items="center" spacing={25}>
             <Flex direction='row' w='80%' style={styles.container}>
                <AIcon name="search1" style={styles.iconImg} color='B4BABC' />
                <TextInput
                    style={styles.input}
                    placeholder='Search friend'
                    color='#B4BABC'
                    onChangeText={value => refine(value)}
                    value={currentRefinement}
                />
            </Flex>
        </Stack>
    )
}

SearchBox.propTypes = {
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 15,
    },

    input:{
        width: "80%",
		paddingTop: 14,
        paddingBottom: 14,
		backgroundColor: "white",
        borderColor: 'transparent',
		fontFamily: "Montserrat",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderRadius: 15,
    },
    iconImg:{
        fontSize: 20,
        backgroundColor: 'transparent',
        padding: 17,
		borderRadius: 15,
    },
})

export default connectSearchBox(SearchBox)