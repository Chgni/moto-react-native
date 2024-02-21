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
    const [user, setUser] = useState('null');
    const [visible, setVisible] = React.useState(false);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false)
    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const getUser = async (token) => {

        try {
            console.log('login token :');
            console.log(token);
            const response = await axios.get('http://192.168.8.92:8000/api/v0.1/auth/me',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                alert('TODO CLEAR JWT AND REDIRECT TO LOGIN!');
            }

            if (response.status === 200) {
                // setUser(response.data);
                // navigation.navigate('Main');
            }
        } catch (error) {
            if( error.response ){
                console.log('token get user'); // => the response payload
                console.log(token); // => the response payload
            }
        }
    };

    useEffect( () => {
        if (isFocused && route.params) {
            const { createdAccount } = route.params;
            if (createdAccount) {
                setVisible(true);
            }
        }
       const getToken = async () => {
           const storedToken = await AsyncStorage.getItem('userToken');
           await getUser(storedToken);
       };
       getToken();
    }, [isFocused]);

    const handleSignIn = async () => {
        if (email && password) {
            try {
                setLoading(true)

                const authService = new AuthService()
                let data = await authService.login(email, password)
                setLoading(false)
                Toast.show('Connecté', Toast.SHORT)

                // navigation.navigate('Main')
                // await (new JwtService()).setJwt(data['access_token'])

            } catch (error) {
                setLoading(false)

                console.log(error.name)
                console.log(error.message)
                if(error.name == "UnauthorizedError") {
                    Toast.show('Identifiants incorrect', Toast.LONG)
                } else {
                    Toast.show('Une erreur est survenue.', Toast.LONG)

                }
                // if( error.response ){
                //     console.log(error.response.data); // => the response payload
                // } else {
                //     console.log(error)
                // }
            }
        } else {
            alert('Merci de remplir tous les champs');
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

            <Snackbar
                visible={visible}
                duration={5000}
                onDismiss={onDismissSnackBar}>
                Compte créé ! Veuillez-vous connecter.
            </Snackbar>
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