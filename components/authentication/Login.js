import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from "react-native";

const Login = ({ navigation }) => {
    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
	<View style={styles.container}>
		<Image style={styles.image} source={require("./../../images/logo.png")} />
		<Text style={styles.appName}>OMP</Text>

		<StatusBar style="auto" />
		<View style={styles.inputView}>
			<TextInput
				style={styles.TextInput}
				placeholder="Username"
				placeholderTextColor="#B4BABC"
				value={username}
				onChangeText={setUsername}
			/>
		</View>

		<View style={styles.inputView}>
			<TextInput
				style={styles.TextInput}
				placeholder="Password"
				placeholderTextColor="#B4BABC"
				secureTextEntry={true}
				value={password}
				onChangeText={setPassword}
			/>
		</View>

		<TouchableOpacity
			style={styles.loginBtn}
			onPress={() => navigation.navigate("Dashboard")}
		>
			<Text style={styles.loginText}>Log In</Text>
		</TouchableOpacity>

		<TouchableOpacity
			onPress={() => navigation.navigate("SignUp")}
		>
			<Text style={styles.signUp_button}>
				Don't have an account?&nbsp;
				<Text
					style={{fontFamily: 'Montserrat-Bold', textDecorationLine:'underline'}}
					onPress={() => navigation.navigate("SignUp")}
				>
					Sign Up
				</Text>
			</Text>
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
	fontSize: 50,
	fontFamily: 'jsMath-cmbx10',
	shadowColor: '#000',
	shadowOffset: {
		width: 0,
		height:4,
	},
	shadowOpacity: 0.25,
	elevation:20

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
	fontFamily: 'Montserrat',
	shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset:{
            width: 1,
            height: 4,
        }
  },

  TextInput: {
	width: '100%',
    height: 50,
    flex: 1,
    padding: 10, //swift right by 10
    marginLeft: 20,
	fontFamily: 'Montserrat',
  },

  signUp_button: {
	fontFamily:'Montserrat',
	fontSize: 14,
	marginBottom: 30,
	marginTop: 10,
  },

  loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#EE6548",
	shadowColor: '#000',
	shadowOffset: {
		width: 0,
		height:4,
	},
	shadowOpacity: 0.25,
	elevation:20
  },

  loginText: {
	color: "#FAFCFD",
	fontFamily: 'Montserrat-Bold',
	fontSize: 15,
  }
});

export default Login
