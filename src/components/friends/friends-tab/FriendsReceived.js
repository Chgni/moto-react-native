import {ScrollView} from "react-native";
import FriendItem from "../../FriendItem";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import FriendsService from "../../../services/FriendsService";
import {useIsFocused} from "@react-navigation/native";

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
    useEffect(() => {
        if (isFocused == true) {
            loadFriendsReceived()

        }
    }, [isFocused]);
    return (
        <ScrollView style={{ padding: 10}}>
            {friendsReceived.map(friend => (
                <FriendItem key={friend.id} friend={friend} type={"received"} onUpdate={updateAll} />
            )) }
        </ScrollView>
    )
});
export default FriendsReceived;
