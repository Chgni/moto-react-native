import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import Toast from "react-native-simple-toast";
import AuthService from "../services/AuthService";

const RegisterScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const authService = new AuthService()
    let registerButtonLabel = "S'enregistrer"
    if (loading == true) {
        registerButtonLabel = "Enregistrement..."
    }
    let connectionButtonDisabled = false
    if (loading == true || email == '' || password == '' || password == '') {
        connectionButtonDisabled = true
    }
    const handleSignIn = async () => {
        if (email && password && username) {
            try {
                setLoading(true)
                await authService.create(username, email, password)
                Toast.show('Votre compte a été créé', Toast.SHORT)
                setLoading(false)
                navigation.navigate('Connexion', {
                    created_email: email,
                    created_password: password
                });
            } catch (error) {
                alert(error);
            }
        } else {
            setLoading(false)
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
                disabled={connectionButtonDisabled}
                title={registerButtonLabel}
                onPress={handleSignIn}
            />
            <Text
                style={{color: 'blue', fontWeight: 'bold', textDecorationLine: 'underline', marginTop: 20}}
                onPress={() => navigation.navigate('Connexion')}
            >Déjà inscrit ? Connectez-vous</Text>
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