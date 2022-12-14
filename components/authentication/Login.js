import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from "react-native";
import { Feather } from '@expo/vector-icons';
import { Flex } from "@react-native-material/core";
import logo from "./../../images/logo.png"
import { logInAsync, selectUser, changeStatus, USER_LOGIN_FAILED, USER_LOGIN_PENDING, USER_LOGIN_SUCCESS, USER_IDLE } from "../../redux/reducers/userSlice";
import { changeEnterGroup } from "../../redux/reducers/groupSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [hidePass, setHidePass] = useState(true);

	const dispatch = useDispatch()
    const user = useSelector(selectUser)

    useEffect(() => {
        if (user.status === USER_LOGIN_FAILED){
            dispatch(changeStatus(USER_IDLE))
			showErrorMessage(user.errorMessage)
        } else if (user.status === USER_LOGIN_SUCCESS){
            dispatch(changeStatus(USER_IDLE))
			dispatch(changeEnterGroup({
				enterGroup: false,
				groupId: "",
			}))
			navigation.navigate("Dashboard")
        }
    },[user.status])

	const handleLogIn = () => {
        if(!username || !password) {
			showErrorMessage('Please fill in the missing input')
        } else{
            dispatch(logInAsync({username, password}))
        }
    }

	const showErrorMessage = (message) => {
		Alert.alert(
			"Log In Failed",
			message,
			[{ text: "OK" }],
			{ cancelable: true }
		);
	}


	return (
	<View style={styles.container}>
		<Spinner
			visible={user.status === USER_LOGIN_PENDING}
			textContent={'Logging In...'}
			textStyle={{color: "white"}}
			cancelable={true}
		/>
		<Image style={styles.image} source={logo} />
		<Text style={styles.appName}>OMP</Text>

		<StatusBar style="auto" />
		<View style={styles.inputView}>
			<TextInput
				style={styles.TextInput}
				placeholder="Username"
				placeholderTextColor="#B4BABC"
				value={username}
				onChangeText={value => setUsername(value.toLowerCase())}
			/>
		</View>

		<Flex style={styles.inputView} direction="row" justify="between" items="center">
			<TextInput
				style={styles.TextInput}
				placeholder="Password"
				placeholderTextColor="#B4BABC"
				secureTextEntry={hidePass}
				value={password}
				onChangeText={setPassword}
			/>
			<Feather
				name={hidePass ? 'eye-off' : 'eye'}
				onPress={() => setHidePass(!hidePass)}
				color={hidePass ? "gray" : "black"}
				size={24}
				style={{ marginRight: 20 }}
			/>
		</Flex>

		<TouchableOpacity
			style={styles.loginBtn}
			onPress={() => dispatch(() => {handleLogIn()})}
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
	marginBottom: 35,
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
	elevation: 5,
  },

  loginText: {
	color: "#FAFCFD",
	fontFamily: 'Montserrat-Bold',
	fontSize: 15,
  }
});

export default Login
