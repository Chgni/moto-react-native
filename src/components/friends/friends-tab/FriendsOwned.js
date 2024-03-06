import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Dialog} from "@rneui/themed";
import FriendItem from "../../FriendItem";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import FriendsService from "../../../services/FriendsService";
import SearchFriend from "../SearchFriend";

const FriendsOwned = forwardRef(({updateAll}, ref) => {
    const [friends, setFriends] = useState([]);
    const isFocused = useIsFocused()
    const friendsService = new FriendsService()
    const [visibleDialog, setVisibleDialog] = useState(false); // add friend dialog visible

    // ça sert a mettre, grace au forwardRef, la fonction a disposition du composant parent
    useImperativeHandle(ref, () => ({
        update: () => loadFriends()
    }));

    const toggleAddFriendDialog = () => {
        setVisibleDialog(!visibleDialog);
    };
    const toggleAddFriendDialogAndRefresh = () => {
        setVisibleDialog(!visibleDialog);
        loadFriends()
    };
    const loadFriends = () => {

        friendsService.getFriends().then(
            (response) => {
                setFriends(response);
            }
        ).catch(
            (error) => {
                setFriends([])
            }
        )
    }

    useEffect(() => {
        if (isFocused == true) {
            loadFriends()

        }
    }, [isFocused]);
    return (
        <>
            <ScrollView style={{ padding: 10}}>
                <View style={styles.addFriendButton}>
                    <Button title='Ajouter un ami' buttonStyle={{ borderRadius: 30}}
                            onPress={toggleAddFriendDialog}
                    />
                </View>
                {friends.map(friend => (
                    <FriendItem key={friend.id} friend={friend} type={"friend"} onUpdate={updateAll} />
                )) }
            </ScrollView>
            <Dialog
                isVisible={visibleDialog}
                onBackdropPress={toggleAddFriendDialog}>
                <SearchFriend onAdd={toggleAddFriendDialogAndRefresh} ></SearchFriend>
            </Dialog>
        </>


    )
});
const styles = StyleSheet.create({
    addFriendButton: {
        display: "flex",
        alignSelf: "center",
        maxWidth: 250,
        marginLeft: 10,
        marginBottom: 10
    }
});

export default FriendsOwned