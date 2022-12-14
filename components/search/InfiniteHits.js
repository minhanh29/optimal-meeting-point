import React, {useState} from 'react';
import { StyleSheet, Text, FlatList} from 'react-native';
import { Avatar, Stack, Box, Flex } from '@react-native-material/core';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';

const test = [{
    objectID: 1,
    name: 'han',
    username: 'han0910',
},{
    objectID: 2,
    name: 'sang',
    username: 'sangnguyen',
}]

const InfiniteHits = ({hits, hasMore, refineNext}) => {
    // console.log(hits[0].objectID)
    return (
        <FlatList
        data={test}
        keyExtractor={item => item.objectID}
        onEndReached={() => hasMore && refineNext}
        renderItem = {({item}) => (
            <Stack w='100%' spacing={20}>
                <Box
                    elevation={3}
                    backgroundColor="white"
                    style={styles.cardContainer}
                    w='100%'
                >
                    <Flex
                        w="100%"
                        items="center"
                        direction="row"
                    >
                        {/* <Avatar
                            label={item.name}
                            icon={props => <Icon name="account" {...props} />}
                            image={item.ava_url ? { uri: item.ava_url } : null}
                            imageStyle={{ borderRadius: 10 }}
                        /> */}
                        <Stack
                            style={{ marginLeft: 17 }}
                            spacing={5}
                            w="58%"
                        >
                            <Text style={styles.cardHeader}>
                                {item.name}
                            </Text>
                            <Text style={styles.infoContent} >
                                @{item.username}
                            </Text>
                        </Stack>
                    </Flex>
                </Box>
            </Stack>
        )}/>
    )
}


InfiniteHits.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refineNext: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    card: {
		width: "100%",
		borderRadius: 15,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowColor: "black",
		padding: 17,
		backgroundColor: "white",
		elevation: 4,
	},
    info: {
		fontFamily: "Montserrat",
		fontSize: 10,
		width: "70%"
	},
    card: {
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
	},
    item:{
        padding: 10,
        flexDirection: 'column',
    },

})

export default connectInfiniteHits(InfiniteHits);