import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from 'qs';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('null');

    const getUser = async (token) => {
        try {
            console.log('login token :');
            console.log(token);
            const response = await axios.get('http://82.65.153.125:8888/api/v0.1/auth/me',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                alert('TODO CLEAR JWT AND REDIRECT TO LOGIN!');
            }

            if (response.status === 200) {
                setUser(response.data);
                navigation.navigate('Main');
            }
        } catch (error) {
            if( error.response ){
                console.log('token get user'); // => the response payload
                console.log(token); // => the response payload
            }
        }
    };

    useEffect( () => {
       const getToken = async () => {
           const storedToken = await AsyncStorage.getItem('userToken');
           await getUser(storedToken);
       };
       getToken();
    }, []);

    const handleSignIn = async () => {
        if (email && password) {
            try {
                const response = await axios.post('http://82.65.153.125:8888/api/v0.1/auth/signin', qs.stringify({
                    username: email,
                    password: password,
                }), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });

                if (response.status === 401) {
                    alert('Identifiants incorrects!');
                }

                if (response.status === 200) {

                    // Stocke le token ici (sera fait dans une future vidéo)
                    await AsyncStorage.setItem('userToken', response.data['access_token']);
                    navigation.navigate('Main');
                }
            } catch (error) {
                if( error.response ){
                    console.log(error.response.data); // => the response payload
                }
            }
        } else {
            alert('Merci de remplir tout les champs');
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
                title="Connexion"
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