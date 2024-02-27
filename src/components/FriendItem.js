import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, BackHandler, Alert} from 'react-native';
import { Card, Button, BottomSheet } from '@rneui/themed';
import {ListItem} from "@rneui/base";
import {useUser} from "../guards/WithAuthGuard";
import FriendsService from "../services/FriendsService";

const FriendItem = ({ friend, type, onUpdate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const friendsService = new FriendsService()
    const list = [
        {
            title: 'Supprimer',
            containerStyle: { backgroundColor: 'red' },
            titleStyle: { color: 'white' },
            onPress: async () => {await deleteUserFriend()}
        },
        {
            title: 'Retour',
            onPress: () => setIsVisible(false),
        },
    ];

    const listReceived = [
        {
            title: 'Accepter',
            onPress: async () => {await acceptUserFriend()}
        },
        {
            title: 'Refuser',
            containerStyle: { backgroundColor: 'red' },
            titleStyle: { color: 'white' },
            onPress: async () => {await deleteUserFriend()}
        },
        {
            title: 'Retour',

            onPress: () => setIsVisible(false),
        },
    ];

    const openMenuActions = (type = null) => {
        if (type === 'sent'){
            return;
        }
        setIsVisible(true);
    }

    const deleteUserFriend = () => {
        friendsService.deleteFriend(friend, type).then(
            () => {
                setIsVisible(false);
                onUpdate();
            }).catch(error => {
                // TODO error handling
            }
        )
    }

    const acceptUserFriend = () => {
        friendsService.acceptFriend(friend, type).then(
            () => {
                console.log('ami accepté')
                onUpdate()
                setIsVisible(false);
            }).catch(error => {
                // TODO error handling
        })
    }
    function handleBackButtonClick() {
        if(isVisible) {
            setIsVisible(false)
            return true
        }
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, []);

    return (
            <TouchableOpacity style={styles.tripCard} onPress={() => openMenuActions(type)}>
                { type === 'friend' && friend.current_user === 'requesting' && <Text h4>{friend.target_user.username}</Text>}
                { type === 'friend' && friend.current_user === 'target' && <Text h4>{friend.requesting_user.username}</Text>}
                { type === 'sent' && <Text h4>{friend.target_user.username}</Text>}
                { type === 'received' && <Text h4>{friend.requesting_user.username}</Text>}
                <BottomSheet modalProps={{}} isVisible={isVisible}>
                    {type !== "received" && list.map((l, i) => (
                        <ListItem
                            key={i}
                            containerStyle={l.containerStyle}
                            onPress={l.onPress}
                        >
                            <ListItem.Content>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                    {type === "received" && listReceived.map((l, i) => (
                        <ListItem
                            key={i}
                            containerStyle={l.containerStyle}
                            onPress={l.onPress}
                        >
                            <ListItem.Content>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </BottomSheet>
            </TouchableOpacity>

    );
};


const styles = StyleSheet.create({
    card: {
      maxWidth: 100
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    actions: {
        color: "#fff"
    },
    tripCard: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'lightgray',
        justifyContent: "center",
        width: "100%",
        borderRadius: 15,
        height: 70,
        padding: 10,
        marginTop: 5,
        marginBottom: 5
    },
});

export default FriendItem;