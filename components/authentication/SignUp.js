
import React from "react";
import { View, 
    StyleSheet, 
    TextInput,
    TouchableOpacity,
    Image,
    Text,
    KeyboardAvoidingView,
    Link,
    Linking,
    } from "react-native";
import { useFonts } from "expo-font";

const SignUp = () => {
    const [fontsLoaded] = useFonts({
		'Montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
		'Montserrat-Italic': require('./assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
		'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        'jsMath-cmbx10': require('./assets/fonts/jsMath-cmbx10.ttf'),
	});
    if(!fontsLoaded) return null;
    const [name, setName] = React.useState("");
    const[username, setUsername] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" :null} style={styles.container}>
            <View style={styles.logo}>
                <Image style={{height: 100, width:100}} source={require('./images/logo.png')} resizeMode="contain" />
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
                <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="Name"/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={username} onChangeText={setUsername} placeholder="Username"/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={address} onChangeText={setAddress} placeholder="Address"/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={password} onChangeText={setPassword} placeholder="Password"/>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.textInput} value={passwordConfirm} onChangeText={setPasswordConfirm} placeholder="Confirm Password"/>
            </View>
            <View style={styles.form}>
                <TouchableOpacity style={styles.button} onPress={() => {console.log("pressed")}}>
                    <Text style={styles.buttonTittle}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.message}>
                <Text style={{fontFamily: 'Montserrat'}}>
                    Already have an account?
                    <Text style={{fontFamily: 'Montserrat', fontWeight:'bold',textDecorationLine:'underline'}} onPress={() => Linking.openURL}> Sign In</Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
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