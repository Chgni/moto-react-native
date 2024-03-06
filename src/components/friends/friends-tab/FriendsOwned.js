import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Dialog} from "@rneui/themed";
import FriendItem from "../../FriendItem";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import FriendsService from "../../../services/FriendsService";
import SearchFriend from "../SearchFriend";
import FloatingButton from "../../common/FloatingButton";
import FriendCard from "../FriendCard";
import {Divider, PaperProvider, Text} from "react-native-paper";

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
                setFriends(response)
            }
        ).catch(
            (error) => {
                //TODO error handling
                setFriends([])
            }
        )
    }
    const removeFriend = async (friend) => {
        try {
            await friendsService.deleteFriend(friend, "friend")
            updateAll();

        } catch (e) {
            // TODO: error handling
        }
    }
    useEffect(() => {
        if (isFocused == true) {
            loadFriends()

        }
    }, [isFocused]);
    return (
        <>
                <ScrollView >
                    {friends.length>0 && <>
                        <Divider/>
                        {friends.map(friend => (
                            <View key={friend.id}>
                                <FriendCard friend={friend} removeFriend={() => removeFriend(friend)}   />
                                <Divider/>
                            </View>
                        )) }
                    </>}
                    {friends.length==0 && <Text>Vous n'avez pas encore d'ami</Text>}

                </ScrollView>

            <View style={styles.addFriendButton}>
                <FloatingButton icon={"plus"} text="Ajouter un ami" onPress={toggleAddFriendDialog} />
            </View>
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
        position: "absolute",
        right: 10,
        bottom: 20,
        borderRadius: 50
    }
});

export default FriendsOwned