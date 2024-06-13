import React, {useContext, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';

import {Tab, TabView} from "@rneui/base";
import FriendsOwned from "../components/friends/friends-tab/FriendsOwned";
import FriendsSent from "../components/friends/friends-tab/FriendsSent";
import FriendsReceived from "../components/friends/friends-tab/FriendsReceived";
import {Appbar, Text} from "react-native-paper";
import FloatingButton from "../components/common/FloatingButton";
import FriendsService from "../services/FriendsService";
import {FriendRequestReceivedContext} from "../contexts/FriendRequestReceivedContext";

const FriendsScreen = () => {
    const [index, setIndex] = React.useState(0);
    const friendsOwnedRef = useRef()
    const friendsReceivedRef = useRef()
    const friendsSentRef = useRef()
    const { fetchFriendRequests } = useContext(FriendRequestReceivedContext);

    const updateAllTabs = () => {
        friendsReceivedRef.current.update()
        fetchFriendRequests()
        friendsOwnedRef.current.update()
        friendsSentRef.current.update()
    }

    useEffect(() => {
        fetchFriendRequests();

        const interval = setInterval(friendsReceivedRef.current.update, 5000); // Mise à jour toutes les 5 secondes
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title={<Text variant='headlineMedium'>CommuMoto - Beta</Text>} />
            </Appbar.Header>
                <Tab value={index} onChange={setIndex} dense>
                    <Tab.Item>Amis</Tab.Item>
                    <Tab.Item>Invitations envoyées</Tab.Item>
                    <Tab.Item>Invitations reçues</Tab.Item>
                </Tab>
                <TabView value={index} onChange={setIndex} animationType="spring">
                    <TabView.Item style={{ width: '100%' }}>
                        <FriendsOwned updateAll={updateAllTabs} ref={friendsOwnedRef} />
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <FriendsSent ref={friendsSentRef} updateAll={updateAllTabs} />
                    </TabView.Item>
                    <TabView.Item style={{width: '100%' }}>
                        <FriendsReceived updateAll={updateAllTabs} ref={friendsReceivedRef} />
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