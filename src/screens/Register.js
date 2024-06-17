import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Toast from "react-native-simple-toast";
import AuthService from "../services/AuthService";
import {Button, TextInput, Text} from "react-native-paper";

const RegisterScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false)
    const authService = new AuthService()
    const handleSignUp = async () => {
        if (email && password && username) {
            try {
                setIsSubmitting(true)
                await authService.create(username, email, password)
                Toast.show('Votre compte a été créé', Toast.SHORT)
                navigation.navigate('Connexion', {
                    created_email: email,
                    created_password: password
                });
            } catch (error) {
                Toast.show('Une erreur est survenue. Veuillez rééssayer plus tard', Toast.LONG)
            }
            setIsSubmitting(false)
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
                title={isSubmitting ? "Enregistrement..." : "S'enregistrer"}
                disabled={!email || !username || !password || isSubmitting}
                loading={isSubmitting}
                mode="contained"
                onPress={handleSignUp}
            >{isSubmitting ? "Enregistrement..." : "S'enregistrer"} </Button>
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