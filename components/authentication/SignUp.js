
import React, { useEffect, useState } from "react";
import { View, 
    StyleSheet, 
    TextInput,
    TouchableOpacity,
    Image,
    Text,
    KeyboardAvoidingView,
    } from "react-native";
import {
    signUpAsync,
    selectUser,
    USER_SIGNUP_SUCCESS ,
    USER_SIGNUP_PENDING,
    USER_IDLE,
    USER_SIGNUP_FAILED,
    changeSignUpStatus,
    signUpFail,
} from "../../a/reducers/userSlice"
import { useFonts } from "expo-font";
import { Provider, useDispatch, useSelector } from "react-redux"
import { Toast } from "react-native-toast-message/lib/src/Toast";
import store from '../../a/store';

const SignUp = () => {
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const dispatch = useDispatch()
	const user = useSelector(selectUser);

    useEffect(() => {
        if (user.signUpStatus === USER_SIGNUP_FAILED){
            Toast.show({
                type: 'error',
                text1: 'Sign Up Failed',
                text2: user.errorMessage,
            })
            dispatch(changeSignUpStatus(USER_IDLE))
        }
        if (user.signUpStatus === USER_SIGNUP_SUCCESS){
            Toast.show({
                type: 'success',
                text1: 'Sign Up Success',
                text2: user.errorMessage,
            })
            dispatch(changeSignUpStatus(USER_IDLE))
        }
    }, [user.signUpStatus])


	const handleSignUp = () => {
        dispatch(signUpAsync({name, username, password}))
	}

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleSignUp()
		}
	}
    console.log(store, "store");
    return (
        // <Provider store ={store}>
                 <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" :null} style={styles.container}>
            <View style={styles.logo}>
                <Image style={{height: 100, width:100}} source={logo} resizeMode="contain" />
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
                <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="Name" onKeyPress={handleKeyDown}/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={username} onChangeText={setUsername} placeholder="Username"onKeyPress={handleKeyDown}/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={password} onChangeText={setPassword} placeholder="Password" onKeyPress={handleKeyDown} secureTextEntry/>
            </View>
			<TextInput style={{height: 0.001}}/>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={passwordConfirm} onChangeText={setPasswordConfirm} placeholder="Confirm Password" onKeyPress={handleKeyDown} secureTextEntry/>
            </View>
            <View style={styles.form}>
                <TouchableOpacity style={styles.button} onPress={() => {handleSignUp}}>
                    <Text style={styles.buttonTittle}>Sign Up</Text>
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
        // </Provider>
    )
};

const styles = StyleSheet.create ({
    container:{
        backgroundColor: '#EDF4F7',
        flex: 1,
    },
    logo:{
        marginTop:120,
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
