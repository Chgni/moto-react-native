import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ToastAndroid} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from 'qs';
import {Snackbar} from "react-native-paper";
import {useIsFocused} from "@react-navigation/native";
import AuthService from "../services/AuthService";
import {UnauthorizedError} from "../errors/ApiCallError";
import JwtService from "../services/JwtService";
import Toast from 'react-native-simple-toast';

const LoginScreen = ({ navigation, route }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = React.useState(false);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false)

    const jwtService = new JwtService()
    const authService = new AuthService()


    useEffect(  () => {
        handleConnectionState();
    }, [isFocused]);
    const handleConnectionState = async () => {
        console.log("j'ai un jwt")

        const jwt = await jwtService.getJwt()
        if(jwt) {
            try {
                console.log('login token :');
                console.log(jwt);
                const user = await authService.getMe()
                navigation.replace('Main');
            } catch (error) {
                if(error.name == "UnauthorizedError") {
                    await authService.disconnect()
                }
            }
        }
    };



    const handleSignIn = async () => {
        if (email && password) {
            try {
                setLoading(true)

                let data = await authService.login(email, password)
                setLoading(false)
                Toast.show('Connecté', Toast.SHORT)
                await jwtService.setJwt(data['access_token'])

                // navigation.replace('Main')
            } catch (error) {
                setLoading(false)
                if(error.name == "UnauthorizedError") {
                    Toast.show('Identifiants incorrect', Toast.LONG)
                } else {
                    Toast.show('Une erreur est survenue.', Toast.LONG)

                }
            }
        }

    };
    let connectionButtonLabel = "Se connecter"
    if (loading == true) {
        connectionButtonLabel = "Connexion..."
    }
    let connectionButtonDisabled = false
    if (loading == true || email == '' || password == '') {
        connectionButtonDisabled = true
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Se connecter</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPassword}
            />
            <Button
                disabled={connectionButtonDisabled}
                title={connectionButtonLabel}
                onPress={handleSignIn}
            />
            <Text
                style={{color: 'blue', fontWeight: 'bold', textDecorationLine: 'underline', marginTop: 20}}
                onPress={() => navigation.navigate('Inscription')}
            >Pas encore inscrit ? Inscrivez-vous</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: 200,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default LoginScreen;