import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import axios from "axios";

const RegisterScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        if (email && password && username) {
            try {
                const response = await axios.post('http://10.0.2.2:8000/api/v1/auth/signup', {
                    username: username,
                    email: email,
                    password: password
                });

                if (response.status === 201) {
                    alert('Inscription réalisée ! Veuillez vous connecter.');
                    navigation.navigate('Connexion');
                }
            } catch (error) {
                alert(error);
            }
        } else {
            alert('Merci de remplir tout les champs');
            return;
        }

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>S'inscrire</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Pseudo"
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPassword}
            />
            <Button
                title="Inscription"
                onPress={handleSignIn}
            />
            <Button
                title="Se connecter"
                onPress={() => navigation.navigate('Connexion')}
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

export default RegisterScreen;