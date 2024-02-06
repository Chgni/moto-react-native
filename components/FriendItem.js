import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Card, Button, BottomSheet } from '@rneui/themed';
import {ListItem} from "@rneui/base";
import {useUser} from "../Guard/WithAuthGuard";
import { deleteFriend, acceptFriend } from "../services/FriendsService";

const FriendItem = ({ friend, type, onUpdate }) => {
    const { user, token } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const list = [
        {
            title: 'Supprimer',
            onPress: async () => {await deleteUserFriend()}
        },
        {
            title: 'Annuler',
            containerStyle: { backgroundColor: 'red' },
            titleStyle: { color: 'white' },
            onPress: () => setIsVisible(false),
        },
    ];

    const listReceived = [
        {
            title: 'Ajouter',
            onPress: async () => {await acceptUserFriend()}
        },
        {
            title: 'Supprimer',
            onPress: async () => {await deleteUserFriend()}
        },
        {
            title: 'Annuler',
            containerStyle: { backgroundColor: 'red' },
            titleStyle: { color: 'white' },
            onPress: () => setIsVisible(false),
        },
    ];

    const openMenuActions = (type = null) => {
        if (type === 'sent'){
            return;
        }
        setIsVisible(true);
    }

    const deleteUserFriend = async () => {
        await deleteFriend(friend, type, token).then(
            (response) => {
                if (response) {
                    setIsVisible(false);
                    onUpdate();
                }
            }
        )
    }

    const acceptUserFriend = async () => {
        await acceptFriend(friend, type, token).then(
            (response) => {
                if (response) {
                    setIsVisible(false);
                    onUpdate();
                }
            }
        )
    }

    return (
            <TouchableOpacity style={styles.tripCard} onPress={() => openMenuActions(type)}>
                { type === 'friend' && <Text h4>{friend.target_user.username}</Text>}
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