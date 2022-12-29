import React from 'react';
import { Text, TouchableOpacity} from 'react-native';
import styles from "./styles"
import { Stack, Flex, FlatList, IconButton} from '@react-native-material/core';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import { deleteGroupAsync, changeEnterGroup } from '../../redux/reducers/groupSlice';
import Icon from "@expo/vector-icons/Ionicons";
import { useDispatch } from 'react-redux';

const GroupHits = ({hits, hasMore, refineNext}) => {
    const dispatch = useDispatch()
    console.log("hits", hits)

  //Left the group
  const handleDelete = (group_id) => {
    console.log("ID",group_id)
    dispatch(deleteGroupAsync(group_id))
  }

	const handleEnter = (id) => {
		console.log("Enter", id)
		dispatch(changeEnterGroup({
			enterGroup: true,
			groupId: id
		}))
		navigation.navigate("Dashboard")
	}

    return (
        <FlatList
        data={hits}
        keyExtractor={item => item.objectID}
        onEndReached={() => hasMore && refineNext}
        renderItem = {({item}) => (
            <TouchableOpacity
                elevation={4}
                backgroundColor="white"
                style={styles.groupCardContainer}
                w='100%'
                key={index}
                onPress={() => handleEnter(item.group_id)}
            >
                <Flex
                w="100%"
                items="center"
                direction="row"
                >
                <Stack
                    style={{ marginLeft: 17 }}
                    spacing={5}
                    w="70%"
                >
                    <Text style={styles.cardHeader} >
                    {item.group_name}
                    </Text>
                    <Text style={styles.infoContent} >
                    3 members
                    </Text>
                </Stack>

                <IconButton
                    icon={props => <Icon name={'exit-outline'} {...props} />}
                    color="#EE6548"
                    style={{ alignSelf: "center", padding: 20, backgroundColor: 'transparent', borderRadius: 10, color: '#9ACDD0', marginRight: 20 }}
                    onPress={() => handleDelete(item.id)}
                />
                </Flex>
            </TouchableOpacity>
          )}/>
      )
}
GroupHits.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refineNext: PropTypes.func.isRequired,
}


export default connectInfiniteHits(GroupHits);
