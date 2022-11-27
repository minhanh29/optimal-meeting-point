import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions} from 'react-native';
import {
	AppBar, HStack, IconButton, Stack, Text, Image
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


const StackNavigator = createStackNavigator()

const App = () => {
	return (
		// <Dashboard />
		<NavigationContainer>
			<StackNavigator.Navigator>
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
	
});

export default App;
