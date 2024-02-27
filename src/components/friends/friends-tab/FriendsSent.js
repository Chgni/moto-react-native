import {ScrollView} from "react-native";
import FriendItem from "../../FriendItem";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import FriendsService from "../../../services/FriendsService";
import {useIsFocused} from "@react-navigation/native";

const FriendsSent = forwardRef(({updateAll}, ref) => {
    const isFocused = useIsFocused()
    const [loadingFriendsSent, setLoadingFriendsSent] = useState(true); // add friend dialog visible
    const friendsService = new FriendsService()
    const [friendsSent, setFriendsSent] = useState([]);
    // ça sert a mettre, grace au forwardRef, la fonction a disposition du composant parent
    useImperativeHandle(ref, () => ({
        update: () => loadFriendsSent()
    }));
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
})
export default FriendsSent;
