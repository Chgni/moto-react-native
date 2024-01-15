import React, {useEffect, useState} from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useUser} from "../Guard/WithAuthGuard";


const HomeScreen = ({ navigation }) => {
    const { user, token } = useUser();


    useEffect( () => {
        console.log('HOME');
        console.log(user.email);
        console.log(token);
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Mon token: {token}</Text>
            <Text>Mon mail : {user.email}</Text>
        </View>
    );
};

export default HomeScreen;