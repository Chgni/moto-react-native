import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {useUser} from "../Guard/WithAuthGuard";
import FriendItem from "../components/FriendItem";
import SearchFriend from "../components/SearchFriend";
import { getFriends, getFriendsRequestsSent, getFriendsRequestsReceived } from "../services/FriendsService";
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
    const [loadingFriends, setLoadingFriends] = useState(true); // add friend dialog visible
    const [loadingFriendsReceived, setLoadingFriendsReceived] = useState(true); // add friend dialog visible
    const [loadingFriendsSent, setLoadingFriendsSent] = useState(true); // add friend dialog visible

    const toggleAddFriendDialog = () => {
        setVisibleDialog(!visibleDialog);
    };

    const toggleAddFriendDialogAndRefresh = () => {
        setVisibleDialog(!visibleDialog);
        getFriendsAndRequests()
    };

    const getFriendsAndRequests = async () => {
        console.log("start get friends");
        setLoadingFriends(true);
        setLoadingFriendsSent(true);
        setLoadingFriendsReceived(true);

        await getFriends(user, token).then(
            (response) => {
                if (response) {
                    setFriends(response);
                    setLoadingFriends(false);
                }
            }
        )
        await getFriendsRequestsReceived(user, token).then(
            (response) => {
                if (response) {
                    setFriendRequestsReceived(response);
                    setLoadingFriendsReceived(false);
                }
            }
        )
        await getFriendsRequestsSent(user, token).then(
            (response) => {
                if (response) {
                    setFriendRequestsSent(response);
                    setLoadingFriendsSent(false);
                }
            }
        )
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
                {loadingFriends && loadingFriendsReceived && loadingFriendsSent && <ActivityIndicator size="small" color="#0000ff" />}
                {!loadingFriends && !loadingFriendsReceived && !loadingFriendsSent && friends.map(friend => (
                    <FriendItem key={friend.user.id} friend={friend} type={"friend"} onUpdate={getFriendsAndRequests} />
                ))}
            </ScrollView>
            <Text>Demandes d'amis reçues ({friendRequestsReceived.length})</Text>
            <ScrollView style={styles.friendsContainer}>
                {loadingFriends && loadingFriendsReceived && loadingFriendsSent && <ActivityIndicator size="small" color="#0000ff" />}
                {!loadingFriends && !loadingFriendsReceived && !loadingFriendsSent && friendRequestsReceived.map(friend => (
                    <FriendItem key={friend.user.id} friend={friend} type={"received"} onUpdate={getFriendsAndRequests}/>
                ))}
            </ScrollView>
            <Text>Demandes d'amis envoyées ({friendRequestsSent.length})</Text>
            <ScrollView style={styles.friendsContainer}>
                {loadingFriends && loadingFriendsReceived && loadingFriendsSent && <ActivityIndicator size="small" color="#0000ff" />}
                {!loadingFriends && !loadingFriendsReceived && !loadingFriendsSent && friendRequestsSent.map(friend => (
                    <FriendItem key={friend.user.id} friend={friend} type={"sent"} onUpdate={getFriendsAndRequests}/>
                ))}
            </ScrollView>
            <Dialog
                isVisible={visibleDialog}
                onBackdropPress={toggleAddFriendDialog}>
                <SearchFriend currentFriends={friends} friendReceived={friendRequestsReceived}
                              friendSent={friendRequestsSent} onAdd={toggleAddFriendDialogAndRefresh}></SearchFriend>
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
        marginLeft: 5
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
        marginLeft: 5
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    }
});

export default FriendsScreen;