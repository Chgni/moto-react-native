import React, {useEffect, useState} from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
    const [token, setToken] = useState(null);


    useEffect( () => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            setToken(storedToken);
        };
        getToken();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Mon token: {token}</Text>
        </View>
    );
};

export default HomeScreen;