import React, { useEffect, useState } from "react";
import { View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Text,
    KeyboardAvoidingView,
	Alert,
    } from "react-native";
import {
    signUpAsync,
    selectUser,
    USER_SIGNUP_SUCCESS ,
    USER_IDLE,
    USER_SIGNUP_FAILED,
	USER_SIGNUP_PENDING,
    changeSignUpStatus,
    signUpFail,
} from "../../redux/reducers/userSlice"
import { useFonts } from "expo-font";
import { useDispatch, useSelector } from "react-redux"
// import logo from "./../../images/logo.png"
import Spinner from 'react-native-loading-spinner-overlay';

const SignUp = ({ navigation }) => {
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");


    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    useEffect(() => {
        if (user.signUpStatus === USER_SIGNUP_FAILED){
            dispatch(changeSignUpStatus(USER_IDLE))
			showErrorMessage(user.errorMessage)
        } else if (user.signUpStatus === USER_SIGNUP_SUCCESS){
            dispatch(changeSignUpStatus(USER_IDLE))
			Alert.alert(
				"Sign Up Success",
				"You have created a new account successfully",
				[{
					text: "Log In",
					onPress: () => navigation.navigate("Login")
				},]);
        }
    },[user.signUpStatus])

	const showErrorMessage = (message) => {
		Alert.alert(
			"Sign Up Failed",
			message,
			[{ text: "OK" }],
			{ cancelable: true }
		);
	}

    const handleSignUp = () => {
		if (!name || !username || !password || !confirmPassword){
			showErrorMessage('Please fill in the missing input')
        } else if(password.length < 6){
			showErrorMessage('Password need to be more than 6 digit')
        } else if(password !== confirmPassword){
			showErrorMessage("Confirmation Password does not match.")
        } else{
            dispatch(signUpAsync({name, username, password}))
        }
	}
    return (
		<KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" :null} style={styles.container}>
			<Spinner
				visible={user.signUpStatus === USER_SIGNUP_PENDING}
				textContent={'Signing Up...'}
				textStyle={{color: "white"}}
				cancelable={true}
			/>
            <View style={styles.logo}>
				<Image style={{height: 100, width:100}} source={{uri : "https://firebasestorage.googleapis.com/v0/b/optimal-meeting-point.appspot.com/o/logo.png?alt=media&token=be4d379b-2075-4f89-af92-0ab134a593a5" }} resizeMode="contain" />
                <Text style={{
                    color:'#9CC7CA',
                    fontFamily:'jsMath-cmbx10',
                    fontSize: 50,
                    shadowOpacity: 0.25,
                    shadowColor: 'black',
                    shadowOffset:{
                        width: 2,
                        height: 6,
                    },
                    letterSpacing: 4,
                    elevation: 4,
                }}>OMP</Text>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="Name" />
            </View>
            <View style={styles.form}>
				<TextInput style={styles.textInput} value={username} onChangeText={value => setUsername(value.toLowerCase())} placeholder="Username"/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry/>
            </View>
			<TextInput style={{height: 0.001}}/>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" secureTextEntry/>
            </View>
            <View style={styles.form}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonTittle} onPress={() => handleSignUp()}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.message}>
                <Text style={{fontFamily: 'Montserrat'}}>
                    Already have an account?&nbsp;
                    <Text
						style={{fontFamily: 'Montserrat-Bold', textDecorationLine:'underline'}}
						onPress={() => navigation.navigate("Login")}
					>
						Sign In
					</Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create ({
    container:{
        backgroundColor: '#EDF4F7',
        flex: 1,
        justifyContent: "center",
        // alignItems: 'center',
    },
    logo:{
        marginBottom: 20,
        width:'100%',
        alignItems: 'center',
        justifyContent:'center',
    },
    form:{
        marginHorizontal: 30,
        alignItems: "center",
        justifyContent: 'center',
        fontFamily:'Montserrat',
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset:{
            width: 1,
            height: 4,
        }
    },
    textInput:{
        marginVertical: 13,
        fontWeight:'bold',
        fontFamily: 'Montserrat',
        backgroundColor:'white',
        height: 40,
        width: '80%',
        paddingLeft: 20,
        borderRadius: 35,
    },
    button:{
        marginTop: 20,
        height: 45,
        width: '80%',
        backgroundColor: '#EE6548',
        borderRadius: 35,
        textAlign: 'center',
        alignContent:'center',
        justifyContent:'center',
    },
    buttonTittle:{
        color: '#FAFCFD',
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 15,
    },
    message:{
        marginTop: 15,
        alignItems: "center",
    }
})

export default SignUp;
