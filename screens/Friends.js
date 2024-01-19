import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import {useUser} from "../Guard/WithAuthGuard";
import FriendItem from "../components/FriendItem";
import SearchFriend from "../components/SearchFriend";

import {
    Button,
    Dialog,
} from '@rneui/themed';

const FriendsScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const [friends, setFriends] = useState([]);
    const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const isFocused = useIsFocused();
    const [visibleDialog, setVisibleDialog] = useState(false); // add friend dialog visible

    const toggleAddFriendDialog = () => {
        setVisibleDialog(!visibleDialog);
    };

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
            console.log('Get friends received');
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user['id']}/friends?pending_received=true`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                setFriendRequestsReceived(response.data)
            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends received');
            }
        }
    };

    const getFriendsRequestsSent = async () => {
        try {
            console.log('Get friends sent');
            const response = await axios.get(`http://10.0.2.2:8000/api/v1/users/${user['id']}/friends?pending_sent=true`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                setFriendRequestsSent(response.data)
            }
        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log('Cant get friends sent');
            }
        }
    };

    const getFriendsAndRequests = async () => {
        await getFriends();
        await getFriendsRequestsReceived();
        await getFriendsRequestsSent();
    }

    useEffect(() => {
        if (isFocused && user && token) {
            console.log('get friend start');
            getFriendsAndRequests()
        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);


    return (
        <View style={styles.container}>
            <View style={styles.friendsContainer}>
                <Text>Mes amis ({friends.length})</Text>
                <Button style={styles.addFriendButton} title='Ajouter un ami'
                    onPress={toggleAddFriendDialog}
                />
            </View>
            <ScrollView style={styles.friendsContainer}>
                {friends.map(friend => (
                    <FriendItem key={friend.id} friend={friend} type={"friend"} onUpdate={getFriendsAndRequests} />
                ))}
            </ScrollView>
            <Text>Demandes d'amis reçues ({friendRequestsReceived.length})</Text>
            <ScrollView style={styles.friendsContainer}>
                {friendRequestsReceived.map(friend => (
                    <FriendItem key={friend.id} friend={friend} type={"received"} onUpdate={getFriendsAndRequests}/>
                ))}
            </ScrollView>
            <Text>Demandes d'amis envoyées ({friendRequestsSent.length})</Text>
            <ScrollView style={styles.friendsContainer}>
                {friendRequestsSent.map(friend => (
                    <FriendItem key={friend.id} friend={friend} type={"sent"} onUpdate={getFriendsAndRequests}/>
                ))}
            </ScrollView>
            <Dialog
                isVisible={visibleDialog}
                onBackdropPress={toggleAddFriendDialog}>
                <SearchFriend currentFriends={friends} friendReceived={friendRequestsReceived} friendSent={friendRequestsSent}></SearchFriend>
            </Dialog>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        display: "flex",
        flexDirection: "column",
        marginRight: 5,
        marginLeft: 5,
        width: "100%"
    },
    friendsButtonContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: 5,
        marginLeft: 5,
        width: "100%"
    },
    addFriendButton: {
        maxWidth: 100,
        marginLeft: 10
    },
    friendsContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: 5,
        marginLeft: 5,
        maxHeight: 250,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    }
});

export default FriendsScreen;