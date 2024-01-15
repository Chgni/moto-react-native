import React, {useEffect, useState} from 'react';
import { View, Text, Button } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const FriendsScreen = ({ navigation }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const isFocused = useIsFocused();


    const getFriends = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user.id}/friends`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setFriends(response.data)
            }
        } catch (error) {
            if( error.response ){
                console.log(error.response.data); // => the response payload
            }
        }
    };

    const getFriendsRequestsReceived = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user.id}/friends/pending/received`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setFriendRequestsReceived(response.data)
            }
        } catch (error) {
            if( error.response ){
                console.log(error.response.data); // => the response payload
            }
        }
    };

    const getFriendsRequestsSent = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user.id}/friends/pending/sent`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setFriendRequestsSent(response.data)
            }
        } catch (error) {
            if( error.response ){
                console.log(error.response.data); // => the response payload
            }
        }
    };

    useEffect( () => {
        if(isFocused) {
            console.log('init friend component');
            getFriends();
            getFriendsRequestsReceived();
            getFriendsRequestsSent();
        }
    }, [isFocused]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Mon token : {token}</Text>
            <Button title='ajouter un ami'></Button>
            <Text>Mes amis ({friends.length})</Text>
            <Text>Demandes d'amis reçues ({friendRequestsReceived.length})</Text>
            <Text>Demandes d'amis envoyées ({friendRequestsSent.length})</Text>
        </View>
    );
};

export default FriendsScreen;