import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Inscription</Text>
            <Button
                title="Déjà Inscrit ?"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
};

export default RegisterScreen;