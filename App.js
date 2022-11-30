import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import {
	StyleSheet,
	View,
	Image,
	TextInput,
	Button,
	TouchableOpacity,
  } from "react-native";
import {
	AppBar, HStack, IconButton, Stack, Text
} from "@react-native-material/core";
import Dashboard from "./components/dashboard/Dashboard";
import Settings from "./components/settings/Settings";
import ChangePassword from "./components/settings/ChangePassword";
import UpdateProfile from "./components/settings/UpdateProfile";
import Groups from "./components/groups/Groups"
import Notifications from "./components/notifications/Notifications";
import { useFonts } from 'expo-font';

import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Friends from "./components/friends/Friends";
import SetAddress from "./components/address/SetAddress";
import { Ionicons } from '@expo/vector-icons';
import Login from "./components/login/Login";


const StackNavigator = createStackNavigator()

export const theme = {
	colors: {
		mainColor1: "#9CC7CA",
		mainColor2: "#EE6548",
		background: "#EDF4F7",
		backButton: "#B4D8D7",
	},
};

const App = () => {
	const [fontsLoaded] = useFonts({
		'Montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-Italic': require('./assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
		'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
	});

	if (!fontsLoaded)
		return null

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<View style={styles.container}>
		 <Image style={styles.image} source={require("./images/logo.png")} />
		 <Text style={styles.appName}>OMP</Text>
	
		 <StatusBar style="auto" />
		<View style={styles.inputView}>
			<TextInput
			style={styles.TextInput}
			placeholder="Username"
			placeholderTextColor="#B4BABC"
			onChangeText={(username) => setUsername(username)}
			/>
		</View>
	
		<View style={styles.inputView}>
			<TextInput
			style={styles.TextInput}
			placeholder="Password"
			placeholderTextColor="#B4BABC"
			secureTextEntry={true}
			onChangeText={(password) => setPassword(password)}
			/>
		</View>
	
		<TouchableOpacity>
			<Text>Don't have an account?</Text>
			<Text style={styles.signUp_button}>Sign Up!</Text>
		</TouchableOpacity>

		<TouchableOpacity style={styles.loginBtn}>
			<Text style={styles.loginText}>LOGIN</Text>
		</TouchableOpacity>

		<TouchableOpacity>
			<Text style={styles.forgot_button}>Forgot Password?</Text>
		</TouchableOpacity> 
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF4F7",
    alignItems: "center",
    justifyContent: "center",
  },

  appName: {
	color:"#9CC7CA",
	marginBottom: 15,
	fontSize: 50
	
  },

  image: {
    marginBottom: 15,
	width: 150,
	height: 150
  },
 
  inputView: {
    backgroundColor: "#FAFCFD",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
 
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#EE6548",
  },

  loginText: {
	color: "#FAFCFD",
  }
});
		// <NavigationContainer theme={theme} >
		// 	<StackNavigator.screen 
		// 		name="Login"
		// 		component={Login}
		// 	/>
		// 	{/* <StackNavigator.Navigator
		// 		screenOptions={({navigation}) => ({
		// 			headerTitle: (props) => <Text
		// 				{...props}
		// 				variant="h6"
		// 				style={styles.header}
		// 			/>,
		// 			headerTitleAlign: 'center',
		// 			headerLeft: () => <IconButton
		// 				onPress={() => navigation.goBack()}
		// 				backgroundColor="white"
		// 				borderRadius={15}
		// 				icon={props => <Ionicons
		// 						{...props}
		// 						name="chevron-back-outline"
		// 						color={theme.colors.backButton}
		// 					/>}
		// 			/>,
		// 			headerTitleContainerStyle: {
		// 				top: 30,
		// 				height: 50,
		// 			},
		// 			headerLeftContainerStyle: {
		// 				left: 30,
		// 				top: 30,
		// 			},
		// 			headerStyle: {
		// 				backgroundColor: theme.colors.background,
		// 				elevation: 0, // remove shadow on Android
		// 				shadowOpacity: 0,  // remove shadow on iOS
		// 			}
		// 		})}
		// 	>
		// 		<StackNavigator.Screen 
		// 			name="Login"
		// 			component={Login}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="Dashboard"
		// 			component={Dashboard}
		// 			options={{
		// 				headerShown: false,
		// 			}}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="Settings"
		// 			component={Settings}
		// 			options={{
		// 				title: "Account",
		// 			}}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="ChangePassword"
		// 			component={ChangePassword}
		// 			options={{
		// 				title: "Change password",
		// 			}}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="UpdateProfile"
		// 			component={UpdateProfile}
		// 			options={{
		// 				title: "Update Profile",
		// 			}}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="Groups"
		// 			component={Groups}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="Notifications"
		// 			component={Notifications}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="Friends"
		// 			component={Friends}
		// 		/>
		// 		<StackNavigator.Screen
		// 			name="Address"
		// 			component={SetAddress}
		// 		/>
		// 	</StackNavigator.Navigator> */}
		// </NavigationContainer>


// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	map: {
// 		width: Dimensions.get("window").width,
// 		height: Dimensions.get("window").height,
// 	},
// 	image: {
// 		width: "10%",
// 		height: "10%",
// 	},
// 	header: {
// 		fontFamily: "Montserrat-Bold"
// 	},
// 	backButton: {
// 		borderRadius: 0,
// 	}
// });

export default App;
