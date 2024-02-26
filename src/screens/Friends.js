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

const FriendsScreen = ({ navigation }) => {
    const { user, token } = useUser();
    const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const isFocused = useIsFocused();
    const [loadingFriendsReceived, setLoadingFriendsReceived] = useState(true); // add friend dialog visible
    const [loadingFriendsSent, setLoadingFriendsSent] = useState(true); // add friend dialog visible
    const [index, setIndex] = React.useState(0);
    const friendService = new FriendsService()




    const getFriendsAndRequests = async () => {
        console.log("start get friends");
        setLoadingFriendsSent(true);
        setLoadingFriendsReceived(true);


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
            getFriendsAndRequests();
        } else {
            console.log('Screen not focused or user/token not available');
        }
    }, [isFocused, user, token]);


    return (
        <View style={styles.container}>
            {/*user && <Header style={styles.headerStyle}
                          centerComponent={{ text: `Bonjour, ${user.username}`, style: { color: '#fff' } }}
                          rightComponent={<SettingHeader/>}
            /> */}
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
                    <ScrollView style={{ padding: 10}}>
                        {friendRequestsSent.map(friend => (
                            <FriendItem key={friend.id} friend={friend} type={"sent"} onUpdate={getFriendsAndRequests} />
                        )) }
                    </ScrollView>
                </TabView.Item>
                <TabView.Item style={{width: '100%' }}>
                    <ScrollView style={{ padding: 10}}>
                        {friendRequestsReceived.map(friend => (
                            <FriendItem key={friend.id} friend={friend} type={"received"} onUpdate={getFriendsAndRequests} />
                        )) }
                    </ScrollView>
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