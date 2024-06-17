import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AuthService from "../services/AuthService";
import {UnauthorizedError} from "../errors/ApiCallError";
import StorageService from "../services/storageService";
import Toast from 'react-native-simple-toast';
import {TextInput, Text, Button} from "react-native-paper";

const LoginScreen = ({ navigation, route }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isFocused = useIsFocused();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const jwtService = new StorageService()
    const authService = new AuthService()

    useEffect( () => {
        if (isFocused && route.params) {


            const { created_email, created_password} = route.params;
            if (created_email && created_password) {
                handleSignIn(created_email, created_password)
            }
        }
    }, [isFocused]);
    useEffect(  () => {
        handleAutoConnection(); //auto connexion au lancement de l'appli
    }, [] );
    const handleAutoConnection = async () => {
        const jwt = await jwtService.getJwt()
        if(jwt) {
            try {
                const user = await authService.getMe()
                navigation.replace('Main');
            } catch (error) {
                if(error.name == "UnauthorizedError") {
                    await authService.disconnect()
                }
            }
        }
    };


    // preset_email sert a gerer la connexion automatique lorsqu'on vient de créer un compte
    const handleSignIn = async (preset_email = null, preset_password = null) => {
        if ((email && password) || (preset_email && preset_password)) {
            try {
                setIsSubmitting(true)
                let data = await authService.login(preset_email ?? email, preset_password ?? password)
                setIsSubmitting(false)
                await jwtService.setJwt(data['access_token'])
                navigation.replace('Main')
            } catch (error) {
                setIsSubmitting(false)
                if(error.name == "UnauthorizedError") {
                    Toast.show('Identifiants incorrect', Toast.LONG)
                }
            }
        }

    };

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
                disabled={!email || !password || isSubmitting}
                loading={isSubmitting}
                mode="contained"
                onPress={() => handleSignIn(null, null)}
            >{isSubmitting ? "Connexion..." : "Se connecter"}</Button>
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