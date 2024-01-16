import React, {useEffect} from 'react';
import { View, Text } from 'react-native';
import {useUser} from "../Guard/WithAuthGuard";


const HomeScreen = ({ navigation }) => {
    const { user, token } = useUser();


    useEffect( () => {

    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Mon token: {token}</Text>
            <Text>User Info: {JSON.stringify(user)}</Text>
        </View>
    );
};

export default HomeScreen;