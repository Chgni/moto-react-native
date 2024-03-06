import React, {useEffect} from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


const LogoutScreen = ({ navigation }) => {

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            navigation.navigate('Connexion');
        } catch (error) {
            console.error('Error while logging out:', error);
        }
    };

    useEffect( () => {
        logout();
    }, []);

    return (
        <View>
            <Text>Déconnexion</Text>
        </View>
    );
};

export default LogoutScreen;