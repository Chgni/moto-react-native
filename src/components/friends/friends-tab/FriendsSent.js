import {ScrollView} from "react-native";
import FriendItem from "../../FriendItem";
import React, {useEffect, useState} from "react";
import FriendsService from "../../../services/FriendsService";
import {useIsFocused} from "@react-navigation/native";

const FriendsSent = () => {
    const isFocused = useIsFocused()
    const [loadingFriendsSent, setLoadingFriendsSent] = useState(true); // add friend dialog visible
    const friendsService = new FriendsService()
    const [friendsSent, setFriendsSent] = useState([]);

    const loadFriendsSent = () => {
        friendsService.getFriendsRequestsSent().then(
            (response) => {
                setFriendsSent(response);
                setLoadingFriendsSent(false);
            }
        ).catch(
            (error) => {
                setFriendsSent([])
            }
        )
    }
    useEffect(() => {
        if (isFocused == true) {
            setLoadingFriendsSent(true)
            loadFriendsSent()

        }
    }, [isFocused]);
    return (
        <ScrollView style={{ padding: 10}}>
            {friendsSent.map(friend => (
                <FriendItem key={friend.id} friend={friend} type={"sent"} onUpdate={loadFriendsSent} />
            )) }
        </ScrollView>
    )
}
export default FriendsSent;
