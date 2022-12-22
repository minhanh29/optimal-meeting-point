import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import {
	IconButton,
	Text,
} from "@react-native-material/core";
import SignUp from "./components/authentication/SignUp";
import Login from "./components/authentication/Login";
// import Dashboard from "./components/dashboard/Dashboard";
import Dashboard from "./components/dashboard/DraftMap";
import Settings from "./components/settings/Settings";
import ChangePassword from "./components/settings/ChangePassword";
import UpdateProfile from "./components/settings/UpdateProfile";
import Groups from "./components/groups/Groups";
import Notifications from "./components/notifications/Notifications";
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Friends from "./components/friends/Friends";
import SetAddress from "./components/address/SetAddress";
import { Ionicons } from '@expo/vector-icons';
import CreateGroup from "./components/groups/CreateGroup";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import { selectUser } from "./redux/reducers/userSlice";
import AddNewMember from "./components/groups/AddNewMember";
import GroupInfo from "./components/groups/GroupInfo";

const StackNavigator = createStackNavigator()

export const theme = {
	colors: {
		mainColor1: "#9CC7CA",
		mainColor2: "#EE6548",
		background: "#EDF4F7",
		backButton: "#B4D8D7",
	},
};

const AppInner = () => {
	const { isAuthenticated } = useSelector(selectUser)

	const [fontsLoaded] = useFonts({
		Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
		"Montserrat-Italic": require("./assets/fonts/Montserrat-Italic-VariableFont_wght.ttf"),
		"Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
		"jsMath-cmbx10": require("./assets/fonts/jsMath-cmbx10.ttf"),
	});

	if (!fontsLoaded) return null;

	return (
		<NavigationContainer theme={theme}>
			<StackNavigator.Navigator
				initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
				screenOptions={({ navigation }) => ({
					headerTitle: props => (
						<Text {...props} variant="h6" style={styles.header} />
					),
					headerTitleAlign: "center",
					headerLeft: () => (
						<IconButton
							onPress={() => navigation.goBack()}
							backgroundColor="white"
							borderRadius={15}
							icon={props => (
								<Ionicons
									{...props}
									name="chevron-back-outline"
									color={theme.colors.backButton}
								/>
							)}
						/>
					),
					headerTitleContainerStyle: {
						top: 30,
						height: 50
					},
					headerLeftContainerStyle: {
						left: 30,
						top: 30
					},
					headerStyle: {
						backgroundColor: theme.colors.background,
						elevation: 0, // remove shadow on Android
						shadowOpacity: 0 // remove shadow on iOS
					}
				})}
			>
				<StackNavigator.Screen
					name="Login"
					component={Login}
					options={{
						headerShown: false
					}}
				/>
				<StackNavigator.Screen
					name="SignUp"
					component={SignUp}
					options={{
						headerShown: false
					}}
				/>
				<StackNavigator.Screen
					name="Dashboard"
					component={Dashboard}
					options={{
						headerShown: false
					}}
				/>
				<StackNavigator.Screen
					name="Settings"
					component={Settings}
					options={{
						title: "Account"
					}}
				/>
				<StackNavigator.Screen
					name="ChangePassword"
					component={ChangePassword}
					options={{
						title: "Change password"
					}}
				/>
				<StackNavigator.Screen
					name="UpdateProfile"
					component={UpdateProfile}
					options={{
						title: "Update Profile"
					}}
				/>
				<StackNavigator.Screen
					name="CreateGroup"
					component={CreateGroup}
					options={{
						title: "Create Groups"
					}}
				/>
				<StackNavigator.Screen
					name="Groups"
					component={Groups}
					options={{
						title: "Your Groups"
					}} 
				/>
				<StackNavigator.Screen
					name="AddNewMember"
					component={AddNewMember}
					options={{
						title: "Add Member"
					}}
				/>
				<StackNavigator.Screen
					name="GroupInfo"
					component={GroupInfo}
					options={{
						title: "Group Info"
					}}
				/>
				<StackNavigator.Screen name="Notifications" component={Notifications} />
				<StackNavigator.Screen name="Friends" component={Friends} />
				<StackNavigator.Screen name="Address" component={SetAddress} />
			</StackNavigator.Navigator>
		</NavigationContainer>
	);
}

const App = () => (
	<Provider store={store}>
		<AppInner />
	</Provider>
)

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
		fontFamily: "Montserrat-Bold"
	},
	backButton: {
		borderRadius: 0,
	}
});

export default App;
