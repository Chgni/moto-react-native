import {TouchableOpacity, View} from "react-native";
import {Avatar, Chip, Dialog, Button, IconButton, MD3Colors, Portal, Text} from "react-native-paper";
import React, {useState} from "react";

//TODO peut-etre merge friend card et member card ?
const FriendCard = ({friend, acceptFriend = null, denyFriend = null, removeFriend}) => {
    const [removeFriendDialogVisible, setRemoveFriendDialogVisible] = useState(false)
    let user = null
    if (friend.current_user == "requesting") {
        user = friend.target_user
    } else {
        user = friend.requesting_user
    }
    const remove = () => {
        removeFriend()
        setRemoveFriendDialogVisible(false)
    }
    return (
        <TouchableOpacity style={{
            paddingStart: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80}}>
            <View  style={{
                flexDirection: "row",
                alignItems: "center",
            }}>
                <View style={{paddingEnd: 15}}>
                    <Avatar.Text label={user.username[0]} size={45} />
                </View>
                <Text variant="titleLarge" style={{paddingEnd: 10}} h4>{user.username}</Text>
            </View>


            { acceptFriend && <IconButton icon={"check"} size={30} style={{marginLeft:"auto"}}   iconColor={MD3Colors.secondary50}

                                       onPress={acceptFriend} >Accepter</IconButton> }
            { denyFriend && <IconButton  icon={"close"} size={30}
                                        onPress={denyFriend}>Refuser</IconButton> }
            { removeFriend && <IconButton icon={"close"} size={30}
                                        onPress={() => setRemoveFriendDialogVisible(true)}>Retirer</IconButton> }
            <Portal>
                <Dialog visible={removeFriendDialogVisible} onDismiss={() => setRemoveFriendDialogVisible(false)}>
                    <Dialog.Content><Text variant="bodyMedium">Voulez vous vraiment retirer {user.username} de vos amis ?</Text></Dialog.Content>

                    <Dialog.Actions>
                        <Button onPress={() => setRemoveFriendDialogVisible(false)}>Non</Button>
                        <Button onPress={remove}>Oui</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </TouchableOpacity>
    )
}
export default FriendCard