import {ScrollView} from "react-native";
import FriendItem from "../../FriendItem";
import React, {useEffect, useState} from "react";
import FriendsService, {getFriends} from "../../../services/FriendsService";
import {useIsFocused} from "@react-navigation/native";

const FriendsReceived = () => {
    const isFocused = useIsFocused()
    const [loadingFriendsReceived, setLoadingFriendsReceived] = useState(true); // add friend dialog visible
    const friendsService = new FriendsService()
    const [friendsReceived, setFriendsReceived] = useState([]);

    const loadFriendsReceived = () => {
        friendsService.getFriendsRequestsReceived().then(
            (response) => {
                setFriendsReceived(response);
                setLoadingFriendsReceived(false);
            }
        ).catch(
            (error) => {
                setFriendsReceived([])
            }
        )
    }
    useEffect(() => {
        if (isFocused == true) {
            setLoadingFriendsReceived(true)
            loadFriendsReceived()

        }
    }, [isFocused]);
    return (
        <ScrollView style={{ padding: 10}}>
            {friendsReceived.map(friend => (
                <FriendItem key={friend.id} friend={friend} type={"received"} onUpdate={loadFriendsReceived} />
            )) }
        </ScrollView>
    )
}
export default FriendsReceived;
