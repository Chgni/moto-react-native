import {ScrollView, View} from "react-native";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import FriendsService from "../../../services/FriendsService";
import {useIsFocused} from "@react-navigation/native";
import FriendCard from "../FriendCard";
import {Divider} from "react-native-paper";

const FriendsSent = forwardRef(({updateAll}, ref) => {
    const isFocused = useIsFocused()
    const friendsService = new FriendsService()
    const [friendsSent, setFriendsSent] = useState([]);
    // ça sert a mettre, grace au forwardRef, la fonction a disposition du composant parent
    useImperativeHandle(ref, () => ({
        update: () => loadFriendsSent()
    }));
    const loadFriendsSent = () => {
        friendsService.getFriendsRequestsSent().then(
            (response) => {
                if (friendsSent !== response) {
                    setFriendsSent(response);
                }
            }
        ).catch(
            (error) => {
                setFriendsSent([])
            }
        )
    }
    useEffect(() => {
        if (isFocused == true) {
            loadFriendsSent()

        }
    }, [isFocused]);
    return (
        <ScrollView >
            <Divider />
            {friendsSent.map(friend => (
                <View key={friend.id}>
                    <FriendCard friend={friend}    />
                    <Divider/>
                </View>            )) }
        </ScrollView>
    )
})
export default FriendsSent;
