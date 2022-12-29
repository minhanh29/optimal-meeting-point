import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, FlatList, View} from 'react-native';
import { Avatar, Stack, Box, Flex } from '@react-native-material/core';
import PropTypes from 'prop-types';
import { connectHits } from 'react-instantsearch-native';
import Icon from "@expo/vector-icons/Ionicons";



const InfiniteHits = ({hits, hasMore, refineNext}) => {

	console.log("Hits", hits)

    return (
        <View>

        </View>
        // <FlatList
        // style={styles.listContainer}
        // data={hits}
        // keyExtractor={item => item.objectID}
        // onEndReached={() => hasMore && refineNext}
        // renderItem = {({item}) => (
        //     <Box w='100%' spacing={20}>
        //         <Box
        //             elevation={3}
        //             backgroundColor="white"
        //             style={styles.cardContainer}
        //             w='80%'
        //         >
        //             <Flex
        //                 w="100%"
        //                 items="center"
        //                 direction="row"
        //             >
        //                 <Avatar
        //                     label={item.name}
        //                     icon={props => <Icon name="account" {...props} />}
        //                     image={item.ava_url ? { uri: item.ava_url } : null}
        //                     imageStyle={{ borderRadius: 10 }}
        //                 />
        //                 <Stack
        //                     style={{ marginLeft: 17 }}
        //                     spacing={5}
        //                     w="58%"
        //                 >
        //                     <Text style={styles.cardHeader}>
        //                         {item.name}
        //                     </Text>
        //                     <Text style={styles.infoContent} >
        //                         @{item.username}
        //                     </Text>
        //                 </Stack>
        //             </Flex>
        //         </Box>
        //     </Box>
        // )}/>
    )
}


InfiniteHits.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refineNext: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    cardContainer: {
		width: "100%",
		borderRadius: 15,
		shadowOffset: {
			width: 0,
			height: 4,
		},
        marginBottom: 10,
		shadowOpacity: 0.25,
		shadowColor: "black",
		padding: 17,
		backgroundColor: "white",
		elevation: 4,
	},
    infoContent: {
		fontFamily: "Montserrat",
		fontSize: 10,
		width: "70%"
	},
    cardHeader: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
	},
    item:{
        padding: 10,
        flexDirection: 'column',
    },
    listContainer:{
        marginLeft: 45,
		width: '80%'
	},

})

export default connectHits(InfiniteHits);
