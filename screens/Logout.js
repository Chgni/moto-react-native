import React, {useEffect, useState} from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useUser} from "../Guard/WithAuthGuard";


const LogoutScreen = ({ navigation }) => {

    const logout = async () => {
        console.log('LOGOUT');
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