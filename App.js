import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import {
	AppBar, HStack, IconButton, Stack, Text
} from "@react-native-material/core";
import Dashboard from "./components/dashboard/Dashboard";
import Settings from "./components/setttings/Settings";
import Groups from "./components/groups/Groups"
import Notifications from "./components/notifications/Notifications";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Friends from "./components/friends/Friends";
import SetAddress from "./components/address/SetAddress";
import { Ionicons } from '@expo/vector-icons';


const StackNavigator = createStackNavigator()

const theme = {
	colors: {
		background: "#EDF4F7",
		backButton: "#B4D8D7",
	},
};

const BackButton = () => {
	console.log(props)
	return <IconButton
		backgroundColor="white"
		borderRadius={15}
		icon={props =>
			<Ionicons
				name="chevron-back-outline"
				color={theme.colors.backButton}
			/>
		}
	/>
}

const App = () => {
	return (
		<NavigationContainer theme={theme}>
			<StackNavigator.Navigator
				navigationOptions={{

				}}
				screenOptions={{
					headerTitle: (props) => <Text
						{...props}
						variant="h5"
						style={styles.header}
					/>,
					headerTitleAlign: 'center',
					headerLeft: (props) => <IconButton
						backgroundColor="white"
						borderRadius={15}
						icon={props => <Ionicons
								name="chevron-back-outline"
								color={theme.colors.backButton}
							/>}
					headerTitleContainerStyle: {
						top: 30,
						height: 50,
					},
					headerLeftContainerStyle: {
						left: 30,
						top: 30,
					},
					headerStyle: {
						backgroundColor: theme.colors.background,
						elevation: 0, // remove shadow on Android
						shadowOpacity: 0,  // remove shadow on iOS
					}
				}}
			>
				<StackNavigator.Screen
					name="Dashboard"
					component={Dashboard}
					options={{
						headerShown: false,
					}}
				/>
				<StackNavigator.Screen
					name="Settings"
					component={Settings}
					options={{
						title: "Account",
						headerTitle: (props) => <Text
							{...props}
							variant="h5"
							style={styles.header}
						/>,
						headerTitleAlign: 'center',
						headerLeft: () => <BackButton {...props} />,
						headerTitleContainerStyle: {
							top: 30,
							height: 50,
						},
						headerLeftContainerStyle: {
							left: 30,
							top: 30,
						},
						headerStyle: {
							backgroundColor: theme.colors.background,
							elevation: 0, // remove shadow on Android
							shadowOpacity: 0,  // remove shadow on iOS
						}
					}}
				/>
				<StackNavigator.Screen
					name="Groups"
					component={Groups}
				/>
				<StackNavigator.Screen
					name="Notifications"
					component={Notifications}
				/>
				<StackNavigator.Screen
					name="Friends"
					component={Friends}
				/>
				<StackNavigator.Screen
					name="Address"
					component={SetAddress}
				/>
			</StackNavigator.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	image: {
		width: "10%",
		height: "10%",
	},
	header: {
		fontWeight: "bold",
	},
	backButton: {
		borderRadius: 0,
	}
});

export default App;
