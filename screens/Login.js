import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        if (email && password) {
            try {
                const response = await axios.post('http://10.0.2.2:8000/api/v1/auth/signin', {
                    "username": email,
                    "password": password,
                });

                if (response.status === 401) {
                    alert('Identifiants incorrects!');
                }

                if (response.status === 200 && response.data.token) {
                    alert('Connexion réussie');
                    // Stocke le token ici (sera fait dans une future vidéo)
                    navigation.navigate('Main');
                }
            } catch (error) {
                //alert('Connexion impossible.');
                navigation.navigate('Main');
            }
        } else {
            alert('Merci de remplir tout les champs');
            return;
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
            <Button
                title="S'inscrire"
                onPress={() => navigation.navigate('Inscription')}
            />
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