import React, {useEffect, useState} from 'react';
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import {useUser} from "../Guard/WithAuthGuard";
import FriendItem from "../components/FriendItem";

const FriendsScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const [friends, setFriends] = useState([]);
    const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const isFocused = useIsFocused();


    const getFriends = async () => {
        try {
            console.log('Get friends');
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user['id']}/friends`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                setFriends(response.data)
            }
        } catch (error) {
            if( error.response ){
               // console.log(error.response.data); // => the response payload
                console.log('Cant get friends');
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
                //console.log(error.response.data); // => the response payload
                console.log('Cant get friends received');
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
                //console.log(error.response.data); // => the response payload
                console.log('Cant get friends sent');
            }
        }
    };

    useEffect(() => {
        if (isFocused && user && token) {
            console.log('get friend');
            getFriends();
            //getFriendsRequestsReceived();
            //getFriendsRequestsSent();
        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);

    return (
        <View style={styles.container}>
            <Button title='ajouter un ami'></Button>
            <Text>Mes amis ({friends.length})</Text>
            <ScrollView style={styles.friendsContainer}>
                {friends.map(friend => (
                    <FriendItem key={friend.id} friend={friend} />
                ))}
            </ScrollView>
            <Text>Demandes d'amis reçues ({friendRequestsReceived.length})</Text>
            <Text>Demandes d'amis envoyées ({friendRequestsSent.length})</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        marginRight: "5px",
        marginLeft: "5px",
        width: "100%"
    },
    friendsContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: "5px",
        marginLeft: "5px",
        maxHeight: "250px",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    }
});

export default FriendsScreen;