import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {useUser} from "../guards/WithAuthGuard";
import FriendItem from "../components/FriendItem";
import SearchFriend from "../components/SearchFriend";
import FriendsService, { getFriendsRequestsSent, getFriendsRequestsReceived } from "../services/FriendsService";
import {
    Button,
    Dialog,
} from '@rneui/themed';
import {Header, Tab, TabView} from "@rneui/base";
import SettingHeader from "../components/SettingHeader";
import FriendsOwned from "../components/friends/friends-tab/FriendsOwned";
import FriendsSent from "../components/friends/friends-tab/FriendsSent";
import FriendsReceived from "../components/friends/friends-tab/FriendsReceived";

const FriendsScreen = ({ navigation }) => {
    const [index, setIndex] = React.useState(0);

    return (
        <View style={styles.container}>
            <Tab value={index} onChange={setIndex} dense>
                <Tab.Item>Amis</Tab.Item>
                <Tab.Item>Invitations envoyées</Tab.Item>
                <Tab.Item>Invitations reçues</Tab.Item>
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <FriendsOwned />
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <FriendsSent />

                </TabView.Item>
                <TabView.Item style={{width: '100%' }}>
                    <FriendsReceived />
                </TabView.Item>
            </TabView>


        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingTop: 15,
        backgroundColor: "#fff"
    },
    headerStyle: {
    },
    friendsButtonContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: 5,
        marginLeft: 5,
        width: "100%"
    },
    addFriendButton: {
        display: "flex",
        alignSelf: "center",
        maxWidth: 250,
        marginLeft: 10,
        marginBottom: 10
    },
    friendsContainer: {
        display: "flex",
        flexDirection: "row",
        margin: 10
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    }
});

export default FriendsScreen;