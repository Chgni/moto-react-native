import {ScrollView, View} from "react-native";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import FriendsService from "../../../services/FriendsService";
import {useIsFocused} from "@react-navigation/native";
import {Divider} from "react-native-paper";
import FriendCard from "../FriendCard";

const FriendsReceived = forwardRef(({updateAll}, ref) => {
    const isFocused = useIsFocused()
    const friendsService = new FriendsService()
    const [friendsReceived, setFriendsReceived] = useState([]);

    // ça sert a mettre, grace au forwardRef, la fonction a disposition du composant parent
    useImperativeHandle(ref, () => ({
        update: () => loadFriendsReceived()
    }));
    const loadFriendsReceived = () => {
        friendsService.getFriendsRequestsReceived().then(
            (response) => {
                setFriendsReceived(response);
            }
        ).catch(
            (error) => {
                setFriendsReceived([])
                // TODO error handling
            }
        )
    }
    const acceptUserFriend = async (friend) => {
        try {
            await friendsService.acceptFriend(friend, "received")
            updateAll()
        } catch (e) {
            // TODO error handling

        }
    }
    const denyUserFriend = async (friend) => {
        try {
            await friendsService.deleteFriend(friend, "received")
            updateAll()
        } catch (e) {
            // TODO error handling

        }
    }
    useEffect(() => {
        if (isFocused == true) {
            loadFriendsReceived()

        }
    }, [isFocused]);
    return (
        <ScrollView>
            <Divider />
            {friendsReceived.map(friend => (
                <View key={friend.id}>
                    <FriendCard friend={friend}
                                acceptFriend={() => acceptUserFriend(friend)}
                                denyFriend={() => denyUserFriend(friend)}   />
                    <Divider/>
                </View>
            )) }
        </ScrollView>
    )
});
export default FriendsReceived;
