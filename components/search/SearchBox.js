import React from "react";
import { StyleSheet, TextInput, Platform } from "react-native";
import { Flex, Stack } from "@react-native-material/core";
import AIcon from "@expo/vector-icons/AntDesign";
import PropTypes from 'prop-types';
import { connectSearchBox } from "react-instantsearch-native";

const SearchBox = ({searchBoxName, setSearchString, width, currentRefinement, refine}) => {
    return(
	<Flex
		direction="row"
		w={width}
		style={{
			...styles.searchHolder,
		}}
	>
		<AIcon name="search1" style={styles.iconImg} color="B4BABC" />
		<TextInput
			style={styles.searchInput}
			placeholder={searchBoxName}
			color="#B4BABC"
			onChangeText={value => {setSearchString(value); refine(value); }}
			value={currentRefinement}
		/>
	</Flex>
    )
}

SearchBox.propTypes = {
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
	iconImg:{
        fontSize: 20,
        backgroundColor: 'transparent',
        padding: 17,
		borderRadius: 15,
    },
    searchHolder:{
        backgroundColor: 'white',
        borderRadius: 15,
    },
    searchInput: {
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
})

export default connectSearchBox(SearchBox)
