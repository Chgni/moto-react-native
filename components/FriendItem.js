import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Card, Button } from '@rneui/themed';

const FriendItem = ({ friend }) => {

    const openMenuActions = () => {
        console.log("open menu");
    }

    return (
        <Card>
            <Text h4>{friend.username}</Text>
            <Button onPress={openMenuActions}>
                <Text style={styles.actions}>Action</Text>
            </Button>
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