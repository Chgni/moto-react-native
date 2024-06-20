import {StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {Avatar, Button, Dialog, Divider, Icon, IconButton, Modal, Portal, Text} from "react-native-paper";

const RouteCard = ({route, onPress, deleteRoute}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const del = () => {
        deleteRoute(route);
        setModalVisible(false)
    }
    return (
        <View>

            <TouchableOpacity onPress={onPress} style={styles.tripCard}>
                <View style={{flexDirection: "column", justifyContent: "center"}}>
                    <Text variant="titleLarge" h4>{route.name}</Text>
                    <View style={{flexDirection:"row"}}>
                        <Avatar.Text style={{alignSelf:"center", marginEnd:5}} label={route.owner.username[0]} size={16} />
                        <Text h4 style={{fontSize:13}}>{route.owner.username}</Text>
                    </View>
                </View>
                {deleteRoute && <View style={{marginLeft: "auto"}}>
                    <IconButton size={25} icon="delete" iconColor="red"   onPress={() => setModalVisible(true)} />
                </View>}

            </TouchableOpacity>
            <Portal>
                <Dialog visible={modalVisible} onDismiss={() => {setModalVisible(false)}} style={styles.modal} >
                    <Dialog.Content><Text variant="bodyMedium">Voulez vous vraiment retirer supprimer le trajet {route.name} ?</Text></Dialog.Content>

                    <Dialog.Actions>
                        <Button onPress={() => setModalVisible(false)}>Non</Button>
                        <Button onPress={() => del()}>Oui</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    )

}

const styles = StyleSheet.create({
    tripCard: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 15,
        height: 60,
        paddingEnd: 10,
        paddingStart: 10,
        marginTop: 5,
        marginBottom: 5
    },


});
export default RouteCard