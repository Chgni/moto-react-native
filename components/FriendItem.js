import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import { Card, Button, BottomSheet } from '@rneui/themed';
import {ListItem} from "@rneui/base";
import axios from "axios";
import {useUser} from "../Guard/WithAuthGuard";
import { deleteFriend } from "../services/FriendsService";

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

    const openMenuActions = () => {
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

    return (
        <Card>
            <Text h4>{friend.user.username}</Text>
            <Button onPress={openMenuActions}>
                <Text style={styles.actions}>Actions</Text>
            </Button>
            <BottomSheet modalProps={{}} isVisible={isVisible}>
                {list.map((l, i) => (
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
        </Card>
    );
};


const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    actions: {
        color: "#fff"
    }
});

export default FriendItem;