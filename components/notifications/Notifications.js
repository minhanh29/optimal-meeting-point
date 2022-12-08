import React, { useState } from 'react'
import { View, TouchableOpacity, Animated } from 'react-native'
import { Avatar, Box, Stack, Text, Switch, Flex, Spacer } from "@react-native-material/core";
import { useTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import GroupInvitations from "./GroupInvitations"
import FriendRequests from "./FriendRequests"
import styles from "./styles"

const renderScene = SceneMap({
  first: GroupInvitations,
  second: FriendRequests,
});


const Notifications = () => {
	const { colors } = useTheme();

	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: 'first', title: 'Group Invitations' },
		{ key: 'second', title: 'Friend Requests' },
	]);

	const renderTabBar = (props) => {
		return (
			<Flex
				direction="row"
				justify="around"
				w="100%"
				style={styles.tabBarContainer}
			>
				{props.navigationState.routes.map((route, i) => {
					return (
						<TouchableOpacity
							key={i}
							style={props.navigationState.index === i ? styles.activeTabBarItem : styles.tabBarItem}
							onPress={() => setIndex(i)}
						>
							<Animated.Text style={props.navigationState.index === i ? styles.activeTabBarItemTitle : styles.tabBarItemTitle}>{route.title}</Animated.Text>
						</TouchableOpacity>
					);
				})}
			</Flex>
		);
	};

	return (
		<View style={{width: "100%", height: '100%', paddingTop: 50}}>
			<View style={{height: "80%", width: "80%", marginLeft: "auto", marginRight: "auto"}}>
				<TabView
					renderTabBar={renderTabBar}
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={{ width: "100%"}}
					style={{overflow: "visible"}}
				/>
			</View>

			<Flex
				direction="row"
				justify="between"
				w="80%"
				position="absolute"
				bottom={10}
				left="10%"
			>
				<TouchableOpacity
					style={{
						...styles.buttonContainer,
						backgroundColor: colors.mainColor1,
						width: "45%"
					}}
					onPress={() => console.log("")}
				>
					<Text style={styles.buttonTitle} color="white">
						Accept
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						...styles.buttonContainer,
						backgroundColor: colors.mainColor2,
						width: "45%"
					}}
					onPress={() => console.log("")}
				>
					<Text style={styles.buttonTitle} color="white">
						Decline
					</Text>
				</TouchableOpacity>
			</Flex>
		</View>
	)
}

export default Notifications
