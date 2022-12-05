import React, { useEffect, useState } from "react";
import { View, 
    StyleSheet, 
    TextInput,
    TouchableOpacity,
    Image,
    Text,
    KeyboardAvoidingView,
    } from "react-native";
import logo from "./../../images/logo.png"
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "@react-native-material/core";
import { store } from "../../redux/store";

const SignUp = ({ navigation }) => {
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");

    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    
    useEffect(() => {
        if (user.signUpStatus === USER_SIGNUP_FAILED){
            console.log("failed")
            dispatch(changeSignUpStatus(USER_IDLE))
        } else if (user.signUpStatus === USER_SIGNUP_SUCCESS){
            console.log("succeeded")
            dispatch(changeSignUpStatus(USER_IDLE))
        }
    },[user.signUpStatus])

    return (
        <Provider store={store}>
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
                <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="Name" />
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={username} onChangeText={setUsername} placeholder="Username"/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry/>
            </View>
			<TextInput style={{height: 0.001}}/>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={passwordConfirm} onChangeText={setPasswordConfirm} placeholder="Confirm Password" secureTextEntry/>
            </View>
            <View style={styles.form}>
                <TouchableOpacity style={styles.button}>
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
    </Provider>
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
