import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Connexion</Text>
            <Button
                title="Inscription"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );
};

export default LoginScreen;