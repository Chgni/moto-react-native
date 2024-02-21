import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import { Card, Button, BottomSheet } from '@rneui/themed';
import {ListItem} from "@rneui/base";
import {useUser} from "../guards/WithAuthGuard";
import { deleteFriend, acceptFriend } from "../services/FriendsService";

const TripItem = ({ trip, type, onUpdate }) => {
    const { user, token } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const list = [
        {
            title: 'Supprimer',
            onPress: async () => {}
        },
        {
            title: 'Annuler',
            containerStyle: { backgroundColor: 'red' },
            titleStyle: { color: 'white' },
            onPress: () => {},
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
        <Card style={styles.card}>
            <Text h4>{trip.name}</Text>
        </Card>
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
    }
});

export default TripItem;