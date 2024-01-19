import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import { Card, Button, BottomSheet } from '@rneui/themed';
import {ListItem} from "@rneui/base";
import axios from "axios";
import {useUser} from "../Guard/WithAuthGuard";

const FriendItem = ({ friend, type, onUpdate }) => {
    const { user, token } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const list = [
        {
            title: 'Supprimer',
            onPress: () => {deleteFriend()}
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

    const deleteFriend = async () => {
        try {
            console.log(friend);
            let statusId = 3;
            if (type === "friend") {
                statusId = 4;
            }
            const response = await axios.patch(`http://10.0.2.2:8000/api/v1/friends/`, {
                    id: friend.id,
                    status : statusId
                }
                , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setIsVisible(false);
                onUpdate();
            }
            if (response.status === 404 || response.status === 400) {
            }

        } catch (error) {
            if( error.response ){
                // console.log(error.response.data); // => the response payload
                console.log(error.response.data);
            }
        }
    }

    return (
        <Card>
            <Text h4>{friend.username}</Text>
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